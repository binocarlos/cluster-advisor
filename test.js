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

		console.dir(stats)
		t.end()
	})
})