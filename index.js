var cadvisor = require('cadvisor')
var async = require('async')

function stats(backends, done){

	async.map(backends, function(backend, nextBackend){
		var cbackend = cadvisor(backend)

		async.parallel({
			host:function(hostDone){
				cbackend.machine(hostDone)
			},
			docker:function(dockerDone){
				cbackend.container('/docker', dockerDone)
			}
		}, function(err, results){
			if(err) return nextBackend(err)

			if(!results || !results.docker || !results.docker.subcontainers){
				return nextBackend('no subcontainers found')
			}

			var server = {
				backend:backend,
				cores:results.host.num_cores,
				memorytotal:results.host.memory_capacity,
				containers:0,
				memoryused:0,
				load:0,
				rx:0,
				tx:0
			}

			async.forEach(results.docker.subcontainers, function(container, nextContainer){
				cbackend.container(container.name, function(err, results){
					if(err) return nextContainer()
					var stat = results.stats[results.stats.length-1]

					server.containers++
					server.memoryused += stat.memory.usage
					server.load += stat.cpu.load
					server.rx += stat.network.rx_bytes
					server.tx += stat.network.tx_bytes

					nextContainer()
				})
			}, function(err){
				if(err) return nextBackend(err)
				nextBackend(null, server)
			})

		})

	}, done)
}

function ps(backends, done){

	async.map(backends, function(backend, nextBackend){
		var cbackend = cadvisor(backend)
		cbackend.container('/docker', function(err, docker){
			if(err) return nextBackend(err)
			if(!docker || !docker.subcontainers){
				return nextBackend('no subcontainers found')
			}
			var containers = []
			async.forEach(docker.subcontainers, function(container, nextContainer){
				cbackend.container(container.name, function(err, container){
					if(err) return nextContainer()
					containers.push(container)
					nextContainer()
				})
			}, function(err){

				if(err) return nextBackend(err)
				nextBackend(null, {
					backend:backend,
					containers:containers
				})

			})

		})
	}, done)
}


module.exports = function(backends){

	backends = backends || []

	return {
		stats:function(done){
			stats(backends, done)
		},
		ps:function(done){
			ps(backends, done)
		}
	}
}