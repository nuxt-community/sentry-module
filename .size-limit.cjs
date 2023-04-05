module.exports = [
  {
    name: 'fixture: base',
    path: 'size-check/base/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: base (gzipped)',
    path: 'size-check/base/.nuxt/dist/client/',
    gzip: true,
  },
  {
    name: 'fixture: lazy',
    path: 'size-check/lazy/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: lazy (gzipped)',
    path: 'size-check/lazy/.nuxt/dist/client/',
    gzip: true,
  },
  {
    name: 'fixture: tracing',
    path: 'size-check/tracing/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: tracing (gzipped)',
    path: 'size-check/tracing/.nuxt/dist/client/',
    gzip: true,
  },
  {
    name: 'fixture: lazy+tracing',
    path: 'size-check/lazy+tracing/.nuxt/dist/client/',
    gzip: false,
  },
  {
    name: 'fixture: lazy+tracing (gzipped)',
    path: 'size-check/lazy+tracing/.nuxt/dist/client/',
    gzip: true,
  },
];
