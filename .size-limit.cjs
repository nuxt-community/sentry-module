module.exports = [
  {
    name: 'fixture: base',
    path: 'size-check/base/.nuxt/dist/client/',
    gzip: false,
    brotli: false,
  },
  {
    name: 'fixture: replay',
    path: 'size-check/replay/.nuxt/dist/client/',
    gzip: false,
    brotli: false,
  },
  {
    name: 'fixture: lazy',
    path: 'size-check/lazy/.nuxt/dist/client/',
    gzip: false,
    brotli: false,
  },
  {
    name: 'fixture: tracing',
    path: 'size-check/tracing/.nuxt/dist/client/',
    gzip: false,
    brotli: false,
  },
  {
    name: 'fixture: lazy+tracing',
    path: 'size-check/lazy+tracing/.nuxt/dist/client/',
    gzip: false,
    brotli: false,
  },
  {
    name: 'fixture: typescript',
    path: 'size-check/typescript/.nuxt/dist/client/',
    gzip: false,
    brotli: false,
  },
]
