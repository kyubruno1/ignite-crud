import assert from 'assert'
import { generate } from 'csv-generate'
import { parse } from 'csv-parse'
import http from 'node:http'
;(async () => {
  const parser = generate({
    high_water_mark: 64 * 64,
    length: 10,
  }).pipe(parse())

  let count = 0

  for await (const record of parser) {
    count++

    const data = JSON.stringify({
      title: `Task ${count}`,
      description: `Descrição da Task ${count}`,
    })

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Lenght': Buffer.byteLength(JSON.stringify(data)),
      },
    }

    const req = http.request(options, (res) => {
      res.setEncoding('utf8')

      res.on('data', (chunk) => {
        console.log(`corpo: ${chunk}`)
      })

      res.on('end', () => {
        console.log(`finalizou chunk ${count}`)
      })
    })
    req.write(data)
    req.end()

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  process.stdout.write('...finalizado\n')
  assert.strictEqual(count, 10)
})()
