## cluster-advisor

Aggregate multiple cadvisor endpoints and choose the least busy server

## install

```bash
$ npm install cluster-advisor
```

## usage

```js
var advisor = require('cluster-advisor')

// create a cluster from multiple cadvisor endpoints
var cluster = advisor([
	'192.168.8.120:8085',
	'192.168.8.121:8085',
	'192.168.8.122:8085'
])

// load the stats which contains information about each machine
cluster(function(err, stats){

	// stats is an array each element representing a machine

})
```

## api

#### `var cluster = advisor(serverArray)`

Create a cluster from an array of server addresses.

#### `cluster.stats(function(err, arr){})`

Map the array of endpoints onto an array container information about each machine.

Each array entry is an object with the following properties:

 * backend - the backend address used
 * cores - the number of cores the host has
 * memorytotal - the total memory capacity of the host
 * containers - the number of containers running on the host
 * memoryused - the total amount of memory used by containers
 * rx_bytes - the total number of bytes received by containers
 * tx_bytes - the total number of bytes sent by containers
 * load - the total load across all containers

These values are simply the SUM of each of the individual container values

The `host` property is useful to determining how much free memory is left because it provides these properties:

 * num_cores
 * memory_capacity

#### `cluster.ps(function(err, arr){})`

Aggregate all containers across the cluster into an array of cadvisor info for each container.

Useful to get a running snapshot of the entire cluster.

Each entry in the returned array is an object with the following properties:

 * backend - the backend address used
 * containers - an array of container data from cadvisor

## licence

MIT