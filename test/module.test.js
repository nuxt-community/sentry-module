const { Nuxt, Builder } = require('nuxt-edge')
const request = require('request-promise-native')

const config = require('./fixture/nuxt.config')

const port = 8080
const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

describe('Module', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(port)
  }, 60000)

  afterAll(async () => {
    // Close all opened resources
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
  })
})
