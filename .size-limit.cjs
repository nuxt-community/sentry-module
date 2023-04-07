module.exports = [
  {
    name: 'fixture: base',
    path: 'size-check/base/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: lazy',
    path: 'size-check/lazy/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: tracing',
    path: 'size-check/tracing/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: lazy+tracing',
    path: 'size-check/lazy+tracing/.nuxt/dist/client/',
    gzip: false,
  },
];
