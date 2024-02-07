// Workaround for broken vuex export definition: https://github.com/vuejs/vuex/issues/2213
declare module 'vuex' {
  export * from 'vuex/types/index.d.ts'
}
