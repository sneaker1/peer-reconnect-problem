
import {createLibp2p} from "libp2p"
import {createFromJSON} from "@libp2p/peer-id-factory"
import {webSockets} from "@libp2p/websockets"
import {noise} from "@chainsafe/libp2p-noise"
import {gossipsub} from "@chainsafe/libp2p-gossipsub"
import {mplex} from "@libp2p/mplex"
import {tcp} from "@libp2p/tcp"
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery"
import { circuitRelayServer, circuitRelayTransport } from "libp2p/circuit-relay"

async function start() {
  const peerId = {
    id: "12D3KooWNvSZnPi3RrhrTwEY4LuuBeB6K6facKUCJcyWG1aoDd2p",
    privKey:
        "CAESYHyCgD+3HtEHm6kzPO6fuwP+BAr/PxfJKlvAOWhc/IqAwrZjCNn0jz93sSl81cP6R6x/g+iVYmR5Wxmn4ZtzJFnCtmMI2fSPP3exKXzVw/pHrH+D6JViZHlbGafhm3MkWQ==",
    pubKey: "CAESIMK2YwjZ9I8/d7EpfNXD+kesf4PolWJkeVsZp+GbcyRZ",
  }
  try {
    const libp2p = await createLibp2p({
      peerId: await createFromJSON(peerId),
      addresses: {
        listen: [
          "/ip4/0.0.0.0/tcp/5001",
          //"/ip4/0.0.0.0/tcp/5002/ws",
        ],
        announce: [
          "/ip4/0.0.0.0/tcp/5001",
          "/ip4/0.0.0.0/tcp/5002/ws",
        ],
      },
      pubsub: gossipsub({
        allowPublishToZeroPeers: true,
      }),
      transports: [
        tcp(),
        circuitRelayTransport({
          //discoverRelays: 1
        })
      ],

      connectionEncryption: [noise()],
      streamMuxers: [mplex()],
      peerDiscovery: [
        // @ts-ignore package has broken typings
        pubsubPeerDiscovery({
          interval: 1000,
        }),
      ],
      relay: circuitRelayServer({
        hopTimeout: 30 * 1000, // incoming relay requests must be resolved within this time limit
        advertise: {
          bootDelay: 15 * 60 * 1000
        },
        reservations: {
          //maxReservations: 15, // how many peers are allowed to reserve relay slots on this server
          //reservationClearInterval: 300 * 1000, // how often to reclaim stale reservations
          //applyDefaultLimit: true, // whether to apply default data/duration limits to each relayed connection
          defaultDurationLimit: 1.5 * 60 * 1000, // the default maximum amount of time a relayed connection can be open for
          //defaultDataLimit: BigInt(2 << 7), // the default maximum number of bytes that can be transferred over a relayed connection
          maxInboundHopStreams: 32, // how many inbound HOP streams are allow simultaneously
          maxOutboundHopStreams: 64, // how many outbound HOP streams are allow simultaneously
        }
      })
    })

    // Listen for new connections to peers
    libp2p.connectionManager.addEventListener("peer:connect", async (evt) => {
      const connection = evt.detail
      console.log(`Connected to ${connection.remotePeer.toString()}`)
    })

    // Listen for peers disconnecting
    libp2p.connectionManager.addEventListener("peer:disconnect", (evt) => {
      const connection = evt.detail
      console.log(`Disconnected from ${connection.remotePeer.toString()}`)
    })

    await libp2p.start()
    console.log("----------------------------------------------")
    console.log("PeerId:", libp2p.peerId.toString())
    console.log(
      "Listening on:",
      libp2p.getMultiaddrs().map((it) => it.toString()),
    )
    console.log("----------------------------------------------")
  } catch (err) {
    console.error(err)
  }
}

start()
