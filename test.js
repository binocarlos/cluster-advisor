var tape = require('tape')
var advisor = require('./')

var cluster = advisor([
	'192.168.8.120:8085',
	'192.168.8.121:8085',
	'192.168.8.122:8085'
])

tape('get stats for the cluster', function(t){
	cluster.stats(function(err, stats){
		if(err){
			t.fail(err, 'load stats')
			t.end()
			return
		}
		t.equal(stats.length, 3, '3 results')
		t.equal(stats[0].backend, '192.168.8.120:8085', 'backend')
		t.equal(stats[0].cores, 1, 'cores')
		t.equal(typeof(stats[0].memorytotal), 'number', 'memory total')
		t.equal(typeof(stats[0].containers), 'number', 'containers')
		t.equal(typeof(stats[0].memoryused), 'number', 'memoryused')
		t.equal(typeof(stats[0].load), 'number', 'load')
		t.equal(typeof(stats[0].rx), 'number', 'rx')
		t.equal(typeof(stats[0].tx), 'number', 'tx')
		
		t.end()
	})
})

tape('get ps for the cluster', function(t){
	cluster.ps(function(err, list){
		if(err){
			t.fail(err, 'load ps')
			t.end()
			return
		}
		t.equal(list.length, 3, '3 results')
		t.equal(list[0].backend, '192.168.8.120:8085', 'backend')
		typeof(list[0].containers[0].spec.memory.limit, 'number', 'container spec')
		
		t.end()
	})
})