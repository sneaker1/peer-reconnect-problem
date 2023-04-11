## Libp2p peer reconnect problem

<strong>
This is now working with circuit-v2 since libp2p v0.43.0  


</strong>



```shell
relay: circuitRelayServer({
  reservations: {
    defaultDurationLimit: 1 * 60 * 1000,
  }
})
```

### Reproduction

1. `npm i`
2. `npm run relay`
3. `npm run alice`
4. `npm run bob`
5. wait until peers connects to each other:

**Alice:**

```shell
Connected to 12D3KooWFYyvJysHGbbYiruVY8bgjKn7sYN9axgbnMxrWVkGXABF
```

**Bob:**

```shell
Connected to 12D3KooWLV3w42LqUb9MWE7oTzG7vwaFjPw9GvDqmsuDif5chTn9
```

6. wait for ~30 seconds for reconnect:

**Alice:**

```shell
Disconnected from 12D3KooWFYyvJysHGbbYiruVY8bgjKn7sYN9axgbnMxrWVkGXABF
disconnected after: 29.936s
Connected to 12D3KooWFYyvJysHGbbYiruVY8bgjKn7sYN9axgbnMxrWVkGXABF
reconnected after: 142.009ms
```

**Bob:**

```shell
Disconnected from 12D3KooWLV3w42LqUb9MWE7oTzG7vwaFjPw9GvDqmsuDif5chTn9
disconnected after: 29.938s
Connected to 12D3KooWLV3w42LqUb9MWE7oTzG7vwaFjPw9GvDqmsuDif5chTn9
reconnected after: 127.931ms
```
