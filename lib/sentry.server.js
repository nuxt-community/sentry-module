export default function (ctx, inject) {
  inject('sentry', process.sentry || {})
}
