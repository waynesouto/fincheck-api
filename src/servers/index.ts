import cluster from 'node:cluster'
import { cpus } from 'node:os'
import process from 'node:process'

import http from '@http/app'

import { env } from '@utils/env'

if (cluster.isPrimary && env.NODE_ENV === 'production') {
	console.log(`[fincheck] Primary cluster with pid ${process.pid} is running`)

	// Fork workers.
	for (let i = 0; i < cpus().length; i++) {
		cluster.fork()
	}

	cluster.on('exit', (worker) => {
		console.log(`[fincheck] Worker with pid ${worker.process.pid} died`)
		// Start a new worker so the service don't stop responding
		setTimeout(() => cluster.fork(), 5000)
	})
} else {
	// Workers can share any TCP connection
	// In this case it is an express server
	const port = env.PORT
	console.log(`[fincheck] Worker with pid ${process.pid} started`)
	http.listen({ port }, (err) => {
		if (err) {
			console.error({ err })
		} else {
			console.log(`[fincheck] Http server running on ${port}`)
		}
	})
}