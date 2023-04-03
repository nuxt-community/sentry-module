import Vue from 'vue'
import { getConfig, init, SentrySdk } from './sentry.client.shared'

export default async function (ctx, inject) {
  const config = await getConfig(ctx)
  init({ Vue, ...config })
  inject('sentry', SentrySdk)
  ctx.$sentry = SentrySdk
}
