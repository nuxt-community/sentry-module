import { setup, loadConfig, get } from '@nuxtjs/module-test-utils'

describe('Smoke test (lazy)', () => {
  let nuxt

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, 'lazy')))
  }, 60000)

  afterAll(async () => {
    // Close all opened resources
    await nuxt.close()
  })

  test('builds and runs', async () => {
    const html = await get('/')
    expect(html).toContain('Works but is not ready!')
  })
})
