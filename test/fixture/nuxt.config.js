module.exports = {
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [
    ['@@', {
      public_key: 'public_key',
      private_key: 'private_key',
      project_id: 'project_id',
      config: {}
    }]
  ]
}
