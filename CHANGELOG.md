

## [8.0.7](https://github.com/nuxt-community/sentry-module/compare/v8.0.6...v8.0.7) (2024-02-07)


### Bug Fixes

* **deps:** update devdependency @sentry/profiling-node to v7 ([#665](https://github.com/nuxt-community/sentry-module/issues/665)) ([df52090](https://github.com/nuxt-community/sentry-module/commit/df5209004dbb9a5016fca32204df7cfdf00af0eb))
* **deps:** update sentry sdk ([#656](https://github.com/nuxt-community/sentry-module/issues/656)) ([89c6576](https://github.com/nuxt-community/sentry-module/commit/89c6576b173e138d891926ee677d2468f296d578))

## [8.0.6](https://github.com/nuxt-community/sentry-module/compare/v8.0.4...v8.0.6) (2023-11-27)


### Bug Fixes

* **deps:** update sentry sdk to ^7.81.1 ([#653](https://github.com/nuxt-community/sentry-module/issues/653)) ([2c17b30](https://github.com/nuxt-community/sentry-module/commit/2c17b30f670b608e9064e7b6f576f23b2cfb180a))
* make it possible to disable internal SDK integrations ([#655](https://github.com/nuxt-community/sentry-module/issues/655)) ([fd32a7e](https://github.com/nuxt-community/sentry-module/commit/fd32a7e47e0556013c4f7b7a2998e796e136ca22))

## [8.0.4](https://github.com/nuxt-community/sentry-module/compare/v8.0.3...v8.0.4) (2023-11-20)


### Bug Fixes

* **deps:** update sentry sdk ([#646](https://github.com/nuxt-community/sentry-module/issues/646)) ([630c80b](https://github.com/nuxt-community/sentry-module/commit/630c80b9b70c251f2628157ad6554b7c14070497))
* set `root` for RewriteFrames integration ([#650](https://github.com/nuxt-community/sentry-module/issues/650)) ([d8c4733](https://github.com/nuxt-community/sentry-module/commit/d8c4733788190307d45cab0ba7f7efd13caae071))

## [8.0.3](https://github.com/nuxt-community/sentry-module/compare/v8.0.2...v8.0.3) (2023-11-16)


### Bug Fixes

* crash on handling unhandled exceptions ([#647](https://github.com/nuxt-community/sentry-module/issues/647)) ([007d84d](https://github.com/nuxt-community/sentry-module/commit/007d84d73e4acb9598641076e4712bbd928c66dc))

## [8.0.2](https://github.com/nuxt-community/sentry-module/compare/v8.0.1...v8.0.2) (2023-11-13)


### Bug Fixes

* **deps:** update sentry sdk ([#632](https://github.com/nuxt-community/sentry-module/issues/632)) ([2de0ed1](https://github.com/nuxt-community/sentry-module/commit/2de0ed19b2b67fe53c9403477304e8f15ada8a7c))
* support external configuration in form of *.ts ([#639](https://github.com/nuxt-community/sentry-module/issues/639)) ([e481548](https://github.com/nuxt-community/sentry-module/commit/e48154899a4a5a3a5fb8b67664f3ae394f995056))

## [8.0.1](https://github.com/nuxt-community/sentry-module/compare/v8.0.0...v8.0.1) (2023-10-31)


### Bug Fixes

* **deps:** update sentry sdk to 7.77.0 ([#624](https://github.com/nuxt-community/sentry-module/issues/624)) ([a5073d1](https://github.com/nuxt-community/sentry-module/commit/a5073d10ce96d157e6349029a98ee1c09abd9582))

## [8.0.0](https://github.com/nuxt-community/sentry-module/compare/v7.5.0...v8.0.0) (2023-10-31)


### ⚠ BREAKING CHANGES

* See migration guide at https://sentry.nuxtjs.org/guide/migration

### Features

* upgrade to webpack-plugin v2 for making releases ([#616](https://github.com/nuxt-community/sentry-module/issues/616)) ([b981638](https://github.com/nuxt-community/sentry-module/commit/b981638304bbad33d9896e25dd78cf518a43ae1a))


### Bug Fixes

* **deps:** update devdependency @sentry/webpack-plugin to v2.8.0 ([#621](https://github.com/nuxt-community/sentry-module/issues/621)) ([d981f1f](https://github.com/nuxt-community/sentry-module/commit/d981f1fbaa4b50fe608339c393802871d5f1d751))
* **deps:** update sentry sdk ([#604](https://github.com/nuxt-community/sentry-module/issues/604)) ([3ae9b5b](https://github.com/nuxt-community/sentry-module/commit/3ae9b5b746ec01031bfd001c764fad30f8343180))

## [8.0.0-rc.0](https://github.com/nuxt-community/sentry-module/compare/v7.5.0...v8.0.0-rc.0) (2023-09-19)


### ⚠ BREAKING CHANGES

* **publishRelease:** See migration guide at https://sentry.nuxtjs.org/guide/migration

### Features

* **publishRelease:** upgrade to webpack-plugin v2 ([d3ed0eb](https://github.com/nuxt-community/sentry-module/commit/d3ed0ebbec899d24ce13b963d9132282e5cdc26a))

## [7.5.0](https://github.com/nuxt-community/sentry-module/compare/v7.4.0...v7.5.0) (2023-08-28)


### Features

* **tracing:** allow configuring vueRouterInstrumentation options ([#614](https://github.com/nuxt-community/sentry-module/issues/614)) ([977a74e](https://github.com/nuxt-community/sentry-module/commit/977a74e7b28f360116514258adcf8cbcec2b5be1))

## [7.4.0](https://github.com/nuxt-community/sentry-module/compare/v7.3.1...v7.4.0) (2023-08-11)


### Bug Fixes

* **deps:** update sentry sdk ([#593](https://github.com/nuxt-community/sentry-module/issues/593)) ([35daec5](https://github.com/nuxt-community/sentry-module/commit/35daec5a015bf087893fd13f20d13a415e9a9c3a))
* **deps:** update sentry sdk to ^7.63.0 ([ecdce1f](https://github.com/nuxt-community/sentry-module/commit/ecdce1f6f7488b016f1f8949a9455cf7ebc2d9d9))
* **lazy:** avoid crash on using mocked instance after real one loaded ([#606](https://github.com/nuxt-community/sentry-module/issues/606)) ([e728a34](https://github.com/nuxt-community/sentry-module/commit/e728a349e212cb422a385ee8619cf00353b318fd))

## [7.3.1](https://github.com/nuxt-community/sentry-module/compare/v7.3.0...v7.3.1) (2023-07-04)


### Bug Fixes

* **deps:** update sentry sdk to ^7.57.0 ([663147b](https://github.com/nuxt-community/sentry-module/commit/663147b0ca6a78d01056de44a538965113291ba4))

## [7.3.0](https://github.com/nuxt-community/sentry-module/compare/v7.2.6...v7.3.0) (2023-05-21)


### Features

* **profiling:** add support for enabling Profiling integration ([#577](https://github.com/nuxt-community/sentry-module/issues/577)) ([9a9aa85](https://github.com/nuxt-community/sentry-module/commit/9a9aa859bec6ca9c6032f3dba5d8f06286fea6ff))


### Bug Fixes

* **deps:** update sentry sdk to ^7.52.1 ([#573](https://github.com/nuxt-community/sentry-module/issues/573)) ([a74cf7f](https://github.com/nuxt-community/sentry-module/commit/a74cf7f8ac63ec2db1f447dd458241311ef7e804))
* **tracing:** tracing not enabled on the server ([#575](https://github.com/nuxt-community/sentry-module/issues/575)) ([7839d03](https://github.com/nuxt-community/sentry-module/commit/7839d037beef628c6c2f5b2860e16fcd3e9617f8))

### [7.2.6](https://github.com/nuxt-community/sentry-module/compare/v7.2.5...v7.2.6) (2023-05-10)


### Bug Fixes

* crash happening when `@nuxt/kit` is installed ([#571](https://github.com/nuxt-community/sentry-module/issues/571)) ([10e650a](https://github.com/nuxt-community/sentry-module/commit/10e650a21881877d7ee89253defabaef77a71c9c))

### [7.2.5](https://github.com/nuxt-community/sentry-module/compare/v7.2.4...v7.2.5) (2023-05-10)


### Bug Fixes

* config merging order on the server side ([#568](https://github.com/nuxt-community/sentry-module/issues/568)) ([4fc42dd](https://github.com/nuxt-community/sentry-module/commit/4fc42dd6c3ebc3947ebf84529b3a7d4b0354c812))

### [7.2.4](https://github.com/nuxt-community/sentry-module/compare/v7.2.3...v7.2.4) (2023-05-09)


### Bug Fixes

* **deps:** update sentry sdk ([#563](https://github.com/nuxt-community/sentry-module/issues/563)) ([bcb9500](https://github.com/nuxt-community/sentry-module/commit/bcb95002ceaedffed5056f55241abad59b91879e))
* remove use of unctx to avoid issues with conflicting versions ([#566](https://github.com/nuxt-community/sentry-module/issues/566)) ([d8dc14b](https://github.com/nuxt-community/sentry-module/commit/d8dc14b06f3276fef2d41c80c5608b75d9543ae5))

### [7.2.3](https://github.com/nuxt-community/sentry-module/compare/v7.2.2...v7.2.3) (2023-05-02)


### Bug Fixes

* ensure Sentry re-initializes in Dev after Nuxt config change ([#565](https://github.com/nuxt-community/sentry-module/issues/565)) ([5ee045d](https://github.com/nuxt-community/sentry-module/commit/5ee045d0c7393070e45505ca1c922c0f4ce7168a))

### [7.2.2](https://github.com/nuxt-community/sentry-module/compare/v7.2.1...v7.2.2) (2023-04-20)


### Bug Fixes

* **deps:** add `@sentry/core` explicitly as its used in types ([7124678](https://github.com/nuxt-community/sentry-module/commit/7124678e4d1e8a787594958ced3bbe5e0e23d42b))

### [7.2.1](https://github.com/nuxt-community/sentry-module/compare/v7.2.0...v7.2.1) (2023-04-18)


### Bug Fixes

* only include 'crash' type for `ReportingObserver` integration ([#560](https://github.com/nuxt-community/sentry-module/issues/560)) ([782b9d1](https://github.com/nuxt-community/sentry-module/commit/782b9d186bcc6fc144c229876a8321a48789a3f2))

## [7.2.0](https://github.com/nuxt-community/sentry-module/compare/v7.1.13...v7.2.0) (2023-04-18)


### Features

* extend guides in docs and add simpler way to enable Replay ([#559](https://github.com/nuxt-community/sentry-module/issues/559)) ([fd57b07](https://github.com/nuxt-community/sentry-module/commit/fd57b070832a3fbe2457d681c063cd59fe910745))


### Bug Fixes

* **deps:** update sentry sdk to ^7.48.0 ([#545](https://github.com/nuxt-community/sentry-module/issues/545)) ([30b283a](https://github.com/nuxt-community/sentry-module/commit/30b283a395c43027d5b0b06e2604f988c262003d))

### [7.1.13](https://github.com/nuxt-community/sentry-module/compare/v7.1.12...v7.1.13) (2023-04-11)


### Bug Fixes

* don't shutdown Sentry SDK after build in dev mode ([#555](https://github.com/nuxt-community/sentry-module/issues/555)) ([b4c1312](https://github.com/nuxt-community/sentry-module/commit/b4c13126da05c9d382567077623553bb63f5a164))

### [7.1.12](https://github.com/nuxt-community/sentry-module/compare/v7.1.11...v7.1.12) (2023-04-11)


### Bug Fixes

* **deps:** update sentry sdk to ^7.47.0 ([#552](https://github.com/nuxt-community/sentry-module/issues/552)) ([30c1a97](https://github.com/nuxt-community/sentry-module/commit/30c1a97cf0769fb94591f017914227dc0df8db57))
* shutdown server Sentry SDK when `nuxt build` is done ([#551](https://github.com/nuxt-community/sentry-module/issues/551)) ([f24cfb2](https://github.com/nuxt-community/sentry-module/commit/f24cfb26a132f5214a8a81f5a2158e3f5317f4c2))

### [7.1.11](https://github.com/nuxt-community/sentry-module/compare/v7.1.10...v7.1.11) (2023-04-03)


### Bug Fixes

* resolve aliases relative to module's dir ([#548](https://github.com/nuxt-community/sentry-module/issues/548)) ([94d7c90](https://github.com/nuxt-community/sentry-module/commit/94d7c907d89e977928f9838b3de7c8af016428a4))
* significantly reduce client bundle size ([#547](https://github.com/nuxt-community/sentry-module/issues/547)) ([ad8eefd](https://github.com/nuxt-community/sentry-module/commit/ad8eefd0e4359f23701f3b92ea2d0d398772404d))

### [7.1.10](https://github.com/nuxt-community/sentry-module/compare/v7.1.9...v7.1.10) (2023-03-28)


### Bug Fixes

* **types:** allow "false" in integrations options ([#543](https://github.com/nuxt-community/sentry-module/issues/543)) ([f4ffef2](https://github.com/nuxt-community/sentry-module/commit/f4ffef24f4d9afeb54cee2253a9252e380fa11ca))

### [7.1.9](https://github.com/nuxt-community/sentry-module/compare/v7.1.8...v7.1.9) (2023-03-27)


### Bug Fixes

* **types:** restore original client types which have more methods ([#540](https://github.com/nuxt-community/sentry-module/issues/540)) ([16bc644](https://github.com/nuxt-community/sentry-module/commit/16bc644d5bdfb363c9d5fa2f9fd222feea21b2c4))

### [7.1.8](https://github.com/nuxt-community/sentry-module/compare/v7.1.7...v7.1.8) (2023-03-27)


### Bug Fixes

* **types:** fix "any" type in arguments of config.beforeSend ([#539](https://github.com/nuxt-community/sentry-module/issues/539)) ([b4b5b48](https://github.com/nuxt-community/sentry-module/commit/b4b5b48a35b8e6276758615cafbf9ad7914aeda2))

### [7.1.7](https://github.com/nuxt-community/sentry-module/compare/v7.1.6...v7.1.7) (2023-03-27)


### Bug Fixes

* **types:** restore type for process.sentry and improve $sentry types ([#534](https://github.com/nuxt-community/sentry-module/issues/534)) ([ed6fd1c](https://github.com/nuxt-community/sentry-module/commit/ed6fd1cffde640d779c541b494fa9654997ee534))

### [7.1.6](https://github.com/nuxt-community/sentry-module/compare/v7.1.5...v7.1.6) (2023-03-24)


### Bug Fixes

* significantly reduce client bundle size ([#532](https://github.com/nuxt-community/sentry-module/issues/532)) ([2297dbc](https://github.com/nuxt-community/sentry-module/commit/2297dbc1a0ce37225877924a0307700ff8eb25e1))

### [7.1.5](https://github.com/nuxt-community/sentry-module/compare/v7.1.4...v7.1.5) (2023-03-24)


### Bug Fixes

* **deps:** update sentry sdk to ^7.43.0 ([#522](https://github.com/nuxt-community/sentry-module/issues/522)) ([80de6b9](https://github.com/nuxt-community/sentry-module/commit/80de6b97fca02905a1fbe51ae5c9d0a536aaf5e1))
* **deps:** update sentry sdk to ^7.44.2 ([#527](https://github.com/nuxt-community/sentry-module/issues/527)) ([82d1f08](https://github.com/nuxt-community/sentry-module/commit/82d1f0821fc7391687675d3e3798666218599ede))
* **deps:** update sentry sdk to ^7.45.0 ([#531](https://github.com/nuxt-community/sentry-module/issues/531)) ([888b395](https://github.com/nuxt-community/sentry-module/commit/888b395584f8d8f2cd1a4c105946f7c6a944ba11))
* **tracing:** connect backend and frontend traces ([#529](https://github.com/nuxt-community/sentry-module/issues/529)) ([30c3127](https://github.com/nuxt-community/sentry-module/commit/30c3127be674614ff1528d77084fcc7822489f64))

### [7.1.4](https://github.com/nuxt-community/sentry-module/compare/v7.1.3...v7.1.4) (2023-03-07)

### [7.1.3](https://github.com/nuxt-community/sentry-module/compare/v7.1.2...v7.1.3) (2023-03-07)


### Bug Fixes

* **deps:** update sentry dependencies to ^7.41.0 ([#516](https://github.com/nuxt-community/sentry-module/issues/516)) ([b318fc3](https://github.com/nuxt-community/sentry-module/commit/b318fc3fea0309027615e2f384c0c4c211dc3001))
* **tracing:** initialize server side tracing correctly ([#517](https://github.com/nuxt-community/sentry-module/issues/517)) ([c7eda63](https://github.com/nuxt-community/sentry-module/commit/c7eda637da1c2526963e4a7b310c14f0882a83c2))

### [7.1.2](https://github.com/nuxt-community/sentry-module/compare/v7.1.1...v7.1.2) (2023-03-03)


### Bug Fixes

* **deps:** update sentry dependencies to ^7.40.0 ([#515](https://github.com/nuxt-community/sentry-module/issues/515)) ([ce402a4](https://github.com/nuxt-community/sentry-module/commit/ce402a4a3a20758cea5f11b0122b0c86c8e38fdd))
* **tracing:** automatically instrument server-side requests ([#514](https://github.com/nuxt-community/sentry-module/issues/514)) ([1d96f8b](https://github.com/nuxt-community/sentry-module/commit/1d96f8bb5c85d3c3247b518c97910cf32a8a268b))
* update list of allowed integrations and allow configuring them ([#513](https://github.com/nuxt-community/sentry-module/issues/513)) ([7933761](https://github.com/nuxt-community/sentry-module/commit/793376171fd00925eb8b09a4cd6d22609513e58d))

### [7.1.1](https://github.com/nuxt-community/sentry-module/compare/v7.1.0...v7.1.1) (2023-02-27)


### Bug Fixes

* **deps:** update sentry dependencies to ^7.39.0 ([#509](https://github.com/nuxt-community/sentry-module/issues/509)) ([46324d7](https://github.com/nuxt-community/sentry-module/commit/46324d737736b14f0ecb9d17dc0574c0ec85864c))
* Windows paths for custom client configuration files ([#510](https://github.com/nuxt-community/sentry-module/issues/510)) ([bdea5fd](https://github.com/nuxt-community/sentry-module/commit/bdea5fd8d42098a5bb03d84c9e00584b40d7e47d))

## [7.1.0](https://github.com/nuxt-community/sentry-module/compare/v7.0.4...v7.1.0) (2023-02-20)


### Features

* support HttpClient client integration ([#504](https://github.com/nuxt-community/sentry-module/issues/504)) ([24d4871](https://github.com/nuxt-community/sentry-module/commit/24d48719e3e2550941d2e664be25a4b5ace39c34))


### Bug Fixes

* **deps:** update sentry dependencies to ^7.38.0 ([#501](https://github.com/nuxt-community/sentry-module/issues/501)) ([4f8b727](https://github.com/nuxt-community/sentry-module/commit/4f8b727d108d0044c089d0098bcf77e22962e464))

### [7.0.4](https://github.com/nuxt-community/sentry-module/compare/v7.0.3...v7.0.4) (2023-02-17)


### Bug Fixes

* apply runtime config last, after merging tracing options ([#499](https://github.com/nuxt-community/sentry-module/issues/499)) ([f434ec4](https://github.com/nuxt-community/sentry-module/commit/f434ec47868b5ad0511f16dc5b50cb4d7760e39c))
* **deps:** update sentry dependencies to ^7.37.2 ([#493](https://github.com/nuxt-community/sentry-module/issues/493)) ([2306a9f](https://github.com/nuxt-community/sentry-module/commit/2306a9f67ebf10ba808e0abe755e78bf610d9e66))
* **docs:** use correct yarn upgrade command ([#494](https://github.com/nuxt-community/sentry-module/issues/494)) ([9614795](https://github.com/nuxt-community/sentry-module/commit/9614795af3a5aa9730a2fbf4346f1eb0f7010059))

### [7.0.3](https://github.com/nuxt-community/sentry-module/compare/v7.0.2...v7.0.3) (2023-01-25)


### Bug Fixes

* **deps:** update sentry dependencies to ^7.33.0 ([#487](https://github.com/nuxt-community/sentry-module/issues/487)) ([23fc7c1](https://github.com/nuxt-community/sentry-module/commit/23fc7c1c38230a92044b68fc9154c264335283da))
* don't require webpack dependency at runtime ([#492](https://github.com/nuxt-community/sentry-module/issues/492)) ([db79dd0](https://github.com/nuxt-community/sentry-module/commit/db79dd032e929b7953d7bd621fccc24b9e364a5f))

### [7.0.2](https://github.com/nuxt-community/sentry-module/compare/v7.0.1...v7.0.2) (2023-01-09)


### Bug Fixes

* **deps:** update sentry dependencies to ^7.29.0 ([#482](https://github.com/nuxt-community/sentry-module/issues/482)) ([96d7a8c](https://github.com/nuxt-community/sentry-module/commit/96d7a8c257be6f3dd625c80544704d91324f958f))
* not able to resolve un-hoisted client-side dependencies ([#486](https://github.com/nuxt-community/sentry-module/issues/486)) ([82071ce](https://github.com/nuxt-community/sentry-module/commit/82071cef777de3d92d145c54aa01febb6a07cb9d))

### [7.0.1](https://github.com/nuxt-community/sentry-module/compare/v7.0.0...v7.0.1) (2023-01-03)


### Bug Fixes

* more accurate type for `serverConfig` option ([#484](https://github.com/nuxt-community/sentry-module/issues/484)) ([95f9f4f](https://github.com/nuxt-community/sentry-module/commit/95f9f4fcb81d56298d9827add9edee112a814fd8))

## [7.0.0](https://github.com/nuxt-community/sentry-module/compare/v6.0.3...v7.0.0) (2022-12-21)


### ⚠ BREAKING CHANGES

* Refer to https://sentry.nuxtjs.org/guide/migration for migration guide.

### Features

* enable tree shaking of Sentry SDK debug code ([#481](https://github.com/nuxt-community/sentry-module/issues/481)) ([c38f666](https://github.com/nuxt-community/sentry-module/commit/c38f66673203d784c1f65a762772fafc5e4bc4be))
* support plugin path for clientConfig and serverConfig ([#477](https://github.com/nuxt-community/sentry-module/issues/477)) ([63e698a](https://github.com/nuxt-community/sentry-module/commit/63e698aea18d453fae733bc2551d1f185f892860))
* **tracing:** enable Vue Router instrumentation by default ([#476](https://github.com/nuxt-community/sentry-module/issues/476)) ([acb2aaf](https://github.com/nuxt-community/sentry-module/commit/acb2aaff6fa99cb35875ae61fe6df13154f99454))
* update Sentry SDK from v6 to v7 ([#461](https://github.com/nuxt-community/sentry-module/issues/461)) ([53bbeec](https://github.com/nuxt-community/sentry-module/commit/53bbeecb74ca11b8228769b7b2f1b02e35db5a3e))


### Bug Fixes

* **deps:** update sentry dependencies to ^7.28.0 ([#478](https://github.com/nuxt-community/sentry-module/issues/478)) ([877dce5](https://github.com/nuxt-community/sentry-module/commit/877dce58190d3b63142e42308934702338541b86))
* gracefully handle Nuxt versions without Runtime Config ([#472](https://github.com/nuxt-community/sentry-module/issues/472)) ([08d7e6c](https://github.com/nuxt-community/sentry-module/commit/08d7e6c8c1f38c519b4ed71bc46b5c39cdb4d89c))

### [6.0.3](https://github.com/nuxt-community/sentry-module/compare/v6.0.2...v6.0.3) (2022-12-13)


### Bug Fixes

* **tracing:** autoSessionTracking not working on the server-side ([#466](https://github.com/nuxt-community/sentry-module/issues/466)) ([67851ba](https://github.com/nuxt-community/sentry-module/commit/67851ba55df38ecdf60c8f7a3da57893e6acfc58))
* incorrect option name in the warning message ([#467](https://github.com/nuxt-community/sentry-module/issues/467)) ([b81b2cf](https://github.com/nuxt-community/sentry-module/commit/b81b2cfb5cbc2055499f5601525f0576b0ff5216))
* **deps:** update devdependency @sentry/webpack-plugin to ^1.20.0 ([#451](https://github.com/nuxt-community/sentry-module/issues/451)) ([e1fef90](https://github.com/nuxt-community/sentry-module/commit/e1fef907dfd2bae4348c9dcb5285cc0b156c8a78))

### [6.0.2](https://github.com/nuxt-community/sentry-module/compare/v6.0.1...v6.0.2) (2022-12-12)


### Bug Fixes

* **tracing:** merge user's tracing configuration ([#463](https://github.com/nuxt-community/sentry-module/issues/463)) ([a567f82](https://github.com/nuxt-community/sentry-module/commit/a567f82ace5a22425c63a807a9736408727227f2))

### [6.0.1](https://github.com/nuxt-community/sentry-module/compare/v6.0.0...v6.0.1) (2022-09-28)


### Bug Fixes

* **tracing:** set `tracesSampleRate` when `tracing` enabled ([#448](https://github.com/nuxt-community/sentry-module/issues/448)) ([fe6d511](https://github.com/nuxt-community/sentry-module/commit/fe6d5111726ac8acc250f83de8a0155fea6bff83)), closes [#447](https://github.com/nuxt-community/sentry-module/issues/447)

## [6.0.0](https://github.com/nuxt-community/sentry-module/compare/v5.1.7...v6.0.0) (2022-08-26)


### ⚠ BREAKING CHANGES

* The server-side `process.sentry` will be created slightly later than before WHEN running the "build" action. It will be created before the pages are built (on `build:compile` hook) while before it was available a bit earlier on `ready` hook (with an issue that it was not always able to pass the project version to Sentry).
* **options:** Remove deprecated `webpackConfig` option. Configure through the `publishRelease` option instead.
* **options:** Remove deprecated `attachCommits` and `repo` options. Those can now be set through the `publishRelease` option.
* **deps:** Don't ship with `@sentry/webpack-plugin` as a dependency. To use the "publishRelease" option, it's now necessary to manually install that package as a dev dependency.

### Features

* support for registering external integrations ([#276](https://github.com/nuxt-community/sentry-module/issues/276)) ([2cf56ef](https://github.com/nuxt-community/sentry-module/commit/2cf56ef81344bf5350eca530dc21d9b9044d1419))


### Bug Fixes

* **deps:** update devdependency @sentry/webpack-plugin to ^1.19.0 ([#434](https://github.com/nuxt-community/sentry-module/issues/434)) ([694ba04](https://github.com/nuxt-community/sentry-module/commit/694ba041203e10eb2c72679874d897dacaa1cc61))
* **deps:** update sentry dependencies ([#405](https://github.com/nuxt-community/sentry-module/issues/405)) ([a465f39](https://github.com/nuxt-community/sentry-module/commit/a465f39aa2ae1eff13969fb27fda28c01c316685))
* throw error instead of logging when @sentry/webpack-plugin missing ([d437a37](https://github.com/nuxt-community/sentry-module/commit/d437a379472e98d4dd660cd9920bb2c1bc578599))
* use different hook for initializing server-side Sentry instance ([#403](https://github.com/nuxt-community/sentry-module/issues/403)) ([20734fa](https://github.com/nuxt-community/sentry-module/commit/20734fabd9cd9aff5cd4eaa9ad3d69c96b85f6ae))
* **deps:** Don't ship with `@sentry/webpack-plugin` as a dependency ([#390](https://github.com/nuxt-community/sentry-module/issues/390)) ([b042a46](https://github.com/nuxt-community/sentry-module/commit/b042a469e3effc6f849839c652e404c807e07d8e))
* **deps:** update dependency @sentry/webpack-plugin to ^1.18.7 ([#392](https://github.com/nuxt-community/sentry-module/issues/392)) ([f72147f](https://github.com/nuxt-community/sentry-module/commit/f72147f4ce22836580e6bcac72a5314bd38c24e2))
* **deps:** update sentry dependencies ([#388](https://github.com/nuxt-community/sentry-module/issues/388)) ([5251cb6](https://github.com/nuxt-community/sentry-module/commit/5251cb64985c84dbed9841ea70bf5e6cf39ab5e9))
* **deps:** update sentry dependencies ([#396](https://github.com/nuxt-community/sentry-module/issues/396)) ([7fec526](https://github.com/nuxt-community/sentry-module/commit/7fec526df4afd9b28b61c57d52091bfadc70694f))


### Code Refactoring

* **options:** remove deprecated "attachCommits" and "repo" ([#393](https://github.com/nuxt-community/sentry-module/issues/393)) ([1efcd28](https://github.com/nuxt-community/sentry-module/commit/1efcd2850a117afd5c775b3864912e8552b971a5))
* **options:** remove deprecated "webpackConfig" ([#394](https://github.com/nuxt-community/sentry-module/issues/394)) ([859101e](https://github.com/nuxt-community/sentry-module/commit/859101ec0a17e50ff7c56551a47e9e0fa5b39992))

### [5.1.7](https://github.com/nuxt-community/sentry-module/compare/v5.1.6...v5.1.7) (2022-02-02)


### Bug Fixes

* **deps:** update sentry dependencies ([#379](https://github.com/nuxt-community/sentry-module/issues/379)) ([e7db004](https://github.com/nuxt-community/sentry-module/commit/e7db004716e3eeef3e990cd9410cdf68c6575408))
* don't pass empty object to integrations constructor ([#387](https://github.com/nuxt-community/sentry-module/issues/387)) ([b4b9415](https://github.com/nuxt-community/sentry-module/commit/b4b94151f13d46697efadab80e20574eba3ac968))

### [5.1.6](https://github.com/nuxt-community/sentry-module/compare/v5.1.5...v5.1.6) (2021-11-26)


### Bug Fixes

* **deps:** update sentry dependencies to ^6.14.3 ([#367](https://github.com/nuxt-community/sentry-module/issues/367)) ([7a38d27](https://github.com/nuxt-community/sentry-module/commit/7a38d277206739339b8cc703cf18c8e192e205af))
* **deps:** update sentry dependencies to ^6.15.0 ([#374](https://github.com/nuxt-community/sentry-module/issues/374)) ([77fcf74](https://github.com/nuxt-community/sentry-module/commit/77fcf745c070e8656280dcae6cc3d5b3e1aae11d))
* don't pass empty object to integrations constructor ([#376](https://github.com/nuxt-community/sentry-module/issues/376)) ([18e12c5](https://github.com/nuxt-community/sentry-module/commit/18e12c59305974e0777bb32bb5c3ad99d7867d06))

### [5.1.5](https://github.com/nuxt-community/sentry-module/compare/v5.1.4...v5.1.5) (2021-11-05)


### Bug Fixes

* **deps:** update sentry dependencies ([#355](https://github.com/nuxt-community/sentry-module/issues/355)) ([9d23a87](https://github.com/nuxt-community/sentry-module/commit/9d23a874e389f6e291359ffa30b7891eda0a69e0))
* **docs:** typo in the lazy-loading section ([#363](https://github.com/nuxt-community/sentry-module/issues/363)) ([dfcc0ab](https://github.com/nuxt-community/sentry-module/commit/dfcc0ab23d00cd6f94a69161bbdde1d1ba427e5b))

### [5.1.4](https://github.com/nuxt-community/sentry-module/compare/v5.1.3...v5.1.4) (2021-10-01)


### Bug Fixes

* **deps:** update sentry dependencies to ^6.13.2 ([#345](https://github.com/nuxt-community/sentry-module/issues/345)) ([e51a438](https://github.com/nuxt-community/sentry-module/commit/e51a4388d03461846ebd2c2dacef22cccd7048f6))
* shutdown Sentry instance after generate ([#353](https://github.com/nuxt-community/sentry-module/issues/353)) ([ee4c293](https://github.com/nuxt-community/sentry-module/commit/ee4c293ba3cd623726250c495901cb88e14299bf))

### [5.1.3](https://github.com/nuxt-community/sentry-module/compare/v5.1.2...v5.1.3) (2021-08-25)


### Bug Fixes

* lodash.merge import error on using runtime config ([acfff72](https://github.com/nuxt-community/sentry-module/commit/acfff728c2702f40fea2fb538fe5eeb3cdddfd5c))

### [5.1.2](https://github.com/nuxt-community/sentry-module/compare/v5.1.1...v5.1.2) (2021-08-19)


### Bug Fixes

* allow overriding all "webpackConfig" options ([#338](https://github.com/nuxt-community/sentry-module/issues/338)) ([bbc46d7](https://github.com/nuxt-community/sentry-module/commit/bbc46d7785c81a6ccce17b836a3ca9f03e29719d))
* allow overriding all webpackConfig setCommits options ([#337](https://github.com/nuxt-community/sentry-module/issues/337)) ([0ea6cbc](https://github.com/nuxt-community/sentry-module/commit/0ea6cbc0a7796921c875b098a7887ef9dbcaf090))
* **types:** use BrowserOptions interface for clientConfig option ([#335](https://github.com/nuxt-community/sentry-module/issues/335)) ([1372a28](https://github.com/nuxt-community/sentry-module/commit/1372a283f6f1081499542292863f99b3b6b7d885))

### [5.1.1](https://github.com/nuxt-community/sentry-module/compare/v5.1.0...v5.1.1) (2021-08-10)


### Bug Fixes

* **deps:** update sentry dependencies ([#309](https://github.com/nuxt-community/sentry-module/issues/309)) ([844fb57](https://github.com/nuxt-community/sentry-module/commit/844fb57bdb088a91ba08f64c7b6af17bb569ab43))

## [5.1.0](https://github.com/nuxt-community/sentry-module/compare/v5.0.3...v5.1.0) (2021-05-28)


### Features

* allow disabling automatic version detection for releases ([#314](https://github.com/nuxt-community/sentry-module/issues/314)) ([e1677fa](https://github.com/nuxt-community/sentry-module/commit/e1677fa74a808e5ab6004f693fd36da4d1b9efef))


### Bug Fixes

* serialize regexpes properly in the server-side config ([#308](https://github.com/nuxt-community/sentry-module/issues/308)) ([9e3ae22](https://github.com/nuxt-community/sentry-module/commit/9e3ae221a7d339436abf01fead73228f3175b4d8)), closes [#307](https://github.com/nuxt-community/sentry-module/issues/307)
* **deps:** update dependency @sentry/webpack-plugin to ^1.15.0 ([#305](https://github.com/nuxt-community/sentry-module/issues/305)) ([a0396b6](https://github.com/nuxt-community/sentry-module/commit/a0396b69ccd1a8d8e2105f874e546ebc95401170))
* handle commonjs/es import styles for @sentry/cli ([#302](https://github.com/nuxt-community/sentry-module/issues/302)) ([d6a818d](https://github.com/nuxt-community/sentry-module/commit/d6a818dd7ed549537285beb8c44a1276a76fcfb9))
* **deps:** update sentry dependencies to ^6.2.5 ([#300](https://github.com/nuxt-community/sentry-module/issues/300)) ([faf6f67](https://github.com/nuxt-community/sentry-module/commit/faf6f67300f2ae89124f3a75e9a91db3763fe798))
* **docs:** fixes typography & content styling ([#288](https://github.com/nuxt-community/sentry-module/issues/288)) ([744bafb](https://github.com/nuxt-community/sentry-module/commit/744bafbeb55741ffeef93c6c62f2d73ef4e93037))

### [5.0.3](https://github.com/nuxt-community/sentry-module/compare/v5.0.2...v5.0.3) (2021-03-18)


### Bug Fixes

* crash on lazy loading when using Runtime Config ([#286](https://github.com/nuxt-community/sentry-module/issues/286)) ([074bf77](https://github.com/nuxt-community/sentry-module/commit/074bf77fa5f3a9afdb8c7a198c0a74dd6db416b9))

### [5.0.2](https://github.com/nuxt-community/sentry-module/compare/v5.0.1...v5.0.2) (2021-02-17)


### Bug Fixes

* support configuring "CaptureConsole" and "Debug" integrations ([#275](https://github.com/nuxt-community/sentry-module/issues/275)) ([73c5b12](https://github.com/nuxt-community/sentry-module/commit/73c5b12fcf8e8bd169eaf1fd559808553c2a9f39)), closes [#274](https://github.com/nuxt-community/sentry-module/issues/274)

### [5.0.1](https://github.com/nuxt-community/sentry-module/compare/v5.0.0...v5.0.1) (2021-02-08)


### Bug Fixes

* better handling of functions options in config ([#267](https://github.com/nuxt-community/sentry-module/issues/267)) ([341bed5](https://github.com/nuxt-community/sentry-module/commit/341bed57a2abd79b69d0c6474afaaa77b363674f))

## [5.0.0](https://github.com/nuxt-community/sentry-module/compare/v4.5.0...v5.0.0) (2021-01-21)


### ⚠ BREAKING CHANGES

* **deps:** This major version release doesn't contain any breaking API/code changes.
Starting with this version sessions data will be sent by default. See [Release Health](https://docs.sentry.io/product/releases/health/) docs to learn more.
You can opt-out of this behavior by setting `autoSessionTracking` option to `false`, for example:

```js
sentry: {
  config: {
    autoSessionTracking: false
  }
}
```

### Features

* Add runtime config support ([#254](https://github.com/nuxt-community/sentry-module/issues/254)) ([7f8b373](https://github.com/nuxt-community/sentry-module/commit/7f8b373a0ec5024fcd2c4ec40b5e01eae8281005))


### Bug Fixes

* **deps:** update sentry deps to v6 (major) ([#265](https://github.com/nuxt-community/sentry-module/issues/265)) ([7316f05](https://github.com/nuxt-community/sentry-module/commit/7316f052b7b05cf71826135230085bb4b33c3a5f))
* **types:** add missing TS types for lazy-loading feature ([#262](https://github.com/nuxt-community/sentry-module/issues/262)) ([4a57102](https://github.com/nuxt-community/sentry-module/commit/4a571023c9779e289d14ae37377321a4cd589fec)), closes [#261](https://github.com/nuxt-community/sentry-module/issues/261)
* support overriding integrations from @sentry/browser ([#257](https://github.com/nuxt-community/sentry-module/issues/257)) ([ae75bee](https://github.com/nuxt-community/sentry-module/commit/ae75beedccd12e144df8af5f695fda45caa83ff9)), closes [#251](https://github.com/nuxt-community/sentry-module/issues/251)

## [4.5.0](https://github.com/nuxt-community/sentry-module/compare/v4.4.0...v4.5.0) (2020-11-11)


### Features

* add support for performance monitoring/tracing ([#250](https://github.com/nuxt-community/sentry-module/issues/250)) ([6a6a3be](https://github.com/nuxt-community/sentry-module/commit/6a6a3be408fbf559ecdcda9db659fcae3c9fdce9)), closes [#224](https://github.com/nuxt-community/sentry-module/issues/224)


### Bug Fixes

* **deps:** update sentry dependencies ^5.27.2 -> ^5.27.3 ([#249](https://github.com/nuxt-community/sentry-module/issues/249)) ([c9c4dde](https://github.com/nuxt-community/sentry-module/commit/c9c4dde53342646fbe5e90daeed9900ff8b97246))

## [4.4.0](https://github.com/nuxt-community/sentry-module/compare/v4.3.5...v4.4.0) (2020-11-04)


### Features

* allow config to be passed to requestHandler ([#243](https://github.com/nuxt-community/sentry-module/issues/243)) ([9daaf4b](https://github.com/nuxt-community/sentry-module/commit/9daaf4b9d0852f9da7cef5f98b3a362fca21a80c))

### [4.3.5](https://github.com/nuxt-community/sentry-module/compare/v4.3.4...v4.3.5) (2020-09-16)


### Bug Fixes

* initialize server-side Sentry when using Nuxt programmatically ([#235](https://github.com/nuxt-community/sentry-module/issues/235)) ([575e4db](https://github.com/nuxt-community/sentry-module/commit/575e4db0b29438494be4f27cb0d710046622e73f)), closes [#230](https://github.com/nuxt-community/sentry-module/issues/230)
* **deps:** update Sentry dependency from 5.20.1 to 5.23.0 ([#223](https://github.com/nuxt-community/sentry-module/issues/223)) ([9894b02](https://github.com/nuxt-community/sentry-module/commit/9894b02fbe0c8f115b07cd4b8e70992d48e0825e))

### [4.3.4](https://github.com/nuxt-community/sentry-module/compare/v4.3.3...v4.3.4) (2020-08-01)


### Bug Fixes

* **lazy:** improve error reporting for postponed global errors ([#220](https://github.com/nuxt-community/sentry-module/issues/220)) ([ecf5d00](https://github.com/nuxt-community/sentry-module/commit/ecf5d006e194cba218bec00f980b651b9c964ded)), closes [/github.com/getsentry/sentry-javascript/blob/9428c9a171a0c6ddcf24935fd03d6492feea0343/packages/browser/src/loader.js#L135-L147](https://github.com/nuxt-community//github.com/getsentry/sentry-javascript/blob/9428c9a171a0c6ddcf24935fd03d6492feea0343/packages/browser/src/loader.js/issues/L135-L147)

### [4.3.3](https://github.com/nuxt-community/sentry-module/compare/v4.3.2...v4.3.3) (2020-07-30)


### Bug Fixes

* **lazy:** crash on iterating "delayedCalls" ([#219](https://github.com/nuxt-community/sentry-module/issues/219)) ([a3de1cf](https://github.com/nuxt-community/sentry-module/commit/a3de1cfc6d108487d616ebff203805e74bc59301))

### [4.3.2](https://github.com/nuxt-community/sentry-module/compare/v4.3.1...v4.3.2) (2020-07-29)


### Bug Fixes

* crash on enabling publishRelease with no "release" ([#217](https://github.com/nuxt-community/sentry-module/issues/217)) ([92e7680](https://github.com/nuxt-community/sentry-module/commit/92e7680b533f14459741c238845a80c213f032fb)), closes [#200](https://github.com/nuxt-community/sentry-module/issues/200)

### [4.3.1](https://github.com/nuxt-community/sentry-module/compare/v4.3.0...v4.3.1) (2020-07-29)


### Bug Fixes

* crash on running module outside of git repo when release not set ([#216](https://github.com/nuxt-community/sentry-module/issues/216)) ([8b00082](https://github.com/nuxt-community/sentry-module/commit/8b00082d6e209615971b89ec26835409cc975819)), closes [#200](https://github.com/nuxt-community/sentry-module/issues/200)

## [4.3.0](https://github.com/nuxt-community/sentry-module/compare/v4.2.1...v4.3.0) (2020-07-28)


### Features

* add types for module configuration ([#213](https://github.com/nuxt-community/sentry-module/issues/213)) ([8236472](https://github.com/nuxt-community/sentry-module/commit/8236472545007c5968a88a6123f1b133c826e87a))


### Bug Fixes

* enable console logging of Vue errors in development ([#214](https://github.com/nuxt-community/sentry-module/issues/214)) ([55b7efe](https://github.com/nuxt-community/sentry-module/commit/55b7efedf149627b2ef4252cd83cd8f48da36e45))
* infer "config.release" automatically if not provided ([#205](https://github.com/nuxt-community/sentry-module/issues/205)) ([059f4e9](https://github.com/nuxt-community/sentry-module/commit/059f4e958c3035bd41db875bc282e41660394468))

### [4.2.1](https://github.com/nuxt-community/sentry-module/compare/v4.2.0...v4.2.1) (2020-07-27)


### Bug Fixes

* user's integrations options not respected on the client ([#208](https://github.com/nuxt-community/sentry-module/issues/208)) ([b81c7d3](https://github.com/nuxt-community/sentry-module/commit/b81c7d3ec2809e62dbf9d1d04053671dd8e21701)), closes [#207](https://github.com/nuxt-community/sentry-module/issues/207)

## [4.2.0](https://github.com/nuxt-community/sentry-module/compare/v4.1.3...v4.2.0) (2020-07-27)


### Features

* support lazy loading of Sentry on the client ([#198](https://github.com/nuxt-community/sentry-module/issues/198)) ([963fead](https://github.com/nuxt-community/sentry-module/commit/963fead523d94661dfc4c597866db66408b7a667)), closes [#127](https://github.com/nuxt-community/sentry-module/issues/127)

### [4.1.3](https://github.com/nuxt-community/sentry-module/compare/v4.1.2...v4.1.3) (2020-07-01)


### Bug Fixes

* **deps:** update Sentry dependencies to v5.18.1 ([#194](https://github.com/nuxt-community/sentry-module/issues/194)) ([39304b5](https://github.com/nuxt-community/sentry-module/commit/39304b50052628cab66d9c67ab30e1e132f3f30a))

### [4.1.2](https://github.com/nuxt-community/sentry-module/compare/v4.1.1...v4.1.2) (2020-06-08)


### Bug Fixes

* **deps:** update Sentry dependencies to ^5.17.0 ([#189](https://github.com/nuxt-community/sentry-module/issues/189)) ([0f98c51](https://github.com/nuxt-community/sentry-module/commit/0f98c513bdad3dd44f174036197fff8d4688345d))

### [4.1.1](https://github.com/nuxt-community/sentry-module/compare/v4.1.0...v4.1.1) (2020-06-08)


### Bug Fixes

* **deps:** move @nuxtjs/eslint-config-typescript to devDependencies ([98bab95](https://github.com/nuxt-community/sentry-module/commit/98bab95b507e587e7cd390326c454b252edfb85f))

## [4.1.0](https://github.com/nuxt-community/sentry-module/compare/v4.0.3...v4.1.0) (2020-06-08)


### Features

* add an option to toggle logging of calls on mocked instance ([#187](https://github.com/nuxt-community/sentry-module/issues/187)) ([6a1692e](https://github.com/nuxt-community/sentry-module/commit/6a1692e2332da31ac7becafa34eca76678df11da)), closes [#176](https://github.com/nuxt-community/sentry-module/issues/176)


### Bug Fixes

* **deps:** update sentry dependencies to v5.16.1 ([#180](https://github.com/nuxt-community/sentry-module/issues/180)) ([a42035f](https://github.com/nuxt-community/sentry-module/commit/a42035fd149586be293416b2aecac78e9ca49c8a))
* properly log state of the Sentry reporting ([#186](https://github.com/nuxt-community/sentry-module/issues/186)) ([36fde1a](https://github.com/nuxt-community/sentry-module/commit/36fde1ad3c4259c916bf21e1af05d417846a1958))

### [4.0.3](https://github.com/nuxt-community/sentry-module/compare/v4.0.2...v4.0.3) (2020-05-04)


### Bug Fixes

* allow overriding webpackConfig urlPrefix ([#178](https://github.com/nuxt-community/sentry-module/issues/178)) ([c52694e](https://github.com/nuxt-community/sentry-module/commit/c52694ee35c54d6d027f4855815aa5870ba5899e))

### [4.0.2](https://github.com/nuxt-community/sentry-module/compare/v4.0.1...v4.0.2) (2020-04-23)


### Bug Fixes

* set public path correctly when building on Windows ([#174](https://github.com/nuxt-community/sentry-module/issues/174)) ([b8b811a](https://github.com/nuxt-community/sentry-module/commit/b8b811a6ce3f3603bcb8d49ec737a6700b4a2f07))

### [4.0.1](https://github.com/nuxt-community/sentry-module/compare/v4.0.0...v4.0.1) (2020-04-15)

## [4.0.0](https://github.com/nuxt-community/sentry-module/compare/v3.3.1...v4.0.0) (2020-03-24)


### ⚠ BREAKING CHANGES

* Requires at least Nuxt v2.10.0

### Bug Fixes

* **deps:** update Sentry dependencies to v5.15.0 ([#166](https://github.com/nuxt-community/sentry-module/issues/166)) ([ebea3ca](https://github.com/nuxt-community/sentry-module/commit/ebea3ca5364f5b1499a9f88e4f6873243e514ed0))
* properly handle publishing when custom webpack config is added ([#167](https://github.com/nuxt-community/sentry-module/issues/167)) ([ca2f680](https://github.com/nuxt-community/sentry-module/commit/ca2f680635996d3cc08ff1783e7cb59af28a91b4))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.3.1](https://github.com/nuxt-community/sentry-module/compare/v3.3.0...v3.3.1) (2020-03-06)

## [3.3.0](https://github.com/nuxt-community/sentry-module/compare/v3.2.4...v3.3.0) (2020-02-27)


### Features

* add sourceMapStyle option ([#158](https://github.com/nuxt-community/sentry-module/issues/158)) ([450bf75](https://github.com/nuxt-community/sentry-module/commit/450bf75f6586877f618bc7ad2a0e560e3d3fc861)), closes [#157](https://github.com/nuxt-community/sentry-module/issues/157)


### Bug Fixes

* **deps:** update Sentry dependencies to v5.12.5  ([#154](https://github.com/nuxt-community/sentry-module/issues/154)) ([34203a6](https://github.com/nuxt-community/sentry-module/commit/34203a6cf981e8e6b2daaeea4b0acd3957df15f5))

### [3.2.4](https://github.com/nuxt-community/sentry-module/compare/v3.2.3...v3.2.4) (2020-02-14)


### Bug Fixes

* released client sourcemaps don't have correct prefix (no /_nuxt/) ([#155](https://github.com/nuxt-community/sentry-module/issues/155)) ([2c8bc83](https://github.com/nuxt-community/sentry-module/commit/2c8bc833d531ca843b4c9bc878ade5b1a49891db))

### [3.2.3](https://github.com/nuxt-community/sentry-module/compare/v3.2.2...v3.2.3) (2020-02-13)


### Bug Fixes

* allow string to webpackConfig.include ([#149](https://github.com/nuxt-community/sentry-module/issues/149)) ([146ff20](https://github.com/nuxt-community/sentry-module/commit/146ff206153792d80c9e460d75b60e99d80d581d))
* don't set urlPrefix for release on server ([#150](https://github.com/nuxt-community/sentry-module/issues/150)) ([8e3e4d1](https://github.com/nuxt-community/sentry-module/commit/8e3e4d1c8289a8abae7337bbca8362da6fc5c1b9))
* don't use Proxy to avoid problems with IE11 compatibility ([f78d7b6](https://github.com/nuxt-community/sentry-module/commit/f78d7b6a4838b45f4fe5b73ee0a1b0f548018824)), closes [#144](https://github.com/nuxt-community/sentry-module/issues/144)
* enable source maps on server also ([c71d848](https://github.com/nuxt-community/sentry-module/commit/c71d8488c2b017dcdc2ecdb560b53fe5f4f671f4))
* release failure with non-standard directory structure ([215c308](https://github.com/nuxt-community/sentry-module/commit/215c30842bcedef18c1d8485f20cdf0293701897)), closes [#132](https://github.com/nuxt-community/sentry-module/issues/132)
* router.base not taken into account when releasing source maps ([#152](https://github.com/nuxt-community/sentry-module/issues/152)) ([8ffce3a](https://github.com/nuxt-community/sentry-module/commit/8ffce3acc00a0314bed0b168d05ae33597515306)), closes [#105](https://github.com/nuxt-community/sentry-module/issues/105)
* **types:** add types for process.sentry ([#153](https://github.com/nuxt-community/sentry-module/issues/153)) ([0ff5969](https://github.com/nuxt-community/sentry-module/commit/0ff59695103c613d21956add54c15b12144de526))

### [3.2.2](https://github.com/nuxt-community/sentry-module/compare/v3.2.1...v3.2.2) (2020-02-03)


### Bug Fixes

* **types:** use @sentry/minimal instead of @sentry/types ([#142](https://github.com/nuxt-community/sentry-module/issues/142)) ([de1874c](https://github.com/nuxt-community/sentry-module/commit/de1874cc3744052bef702f7c33f484c84b409119))

### [3.2.1](https://github.com/nuxt-community/sentry-module/compare/v3.2.0...v3.2.1) (2020-01-31)


### Bug Fixes

* **types:** Make $sentry non-optional since the Proxy is now used when disabled ([238a68d](https://github.com/nuxt-community/sentry-module/commit/238a68d8a540f5410dbb4ffb604d036cef0b8bed))

## [3.2.0](https://github.com/nuxt-community/sentry-module/compare/v3.1.1...v3.2.0) (2020-01-31)


### Features

* mock sentry in case it is disabled ([da106ab](https://github.com/nuxt-community/sentry-module/commit/da106ab9c40a37173e0f0b43ab3899c545ef225d))

### [3.0.1](https://github.com/nuxt-community/sentry-module/compare/v3.0.0...v3.0.1) (2019-10-14)

## [3.0.0](https://github.com/nuxt-community/sentry-module/compare/v2.3.2...v3.0.0) (2019-05-12)

### Features
* sentry 5 update, plugin for server side, ([#72](https://github.com/nuxt-community/sentry-module/issues/72)) ([17322f9](https://github.com/nuxt-community/sentry-module/commit/17322f9))

### Bug Fixes

* fix typo in sentry.client ([#81](https://github.com/nuxt-community/sentry-module/issues/81)) ([77a8f23](https://github.com/nuxt-community/sentry-module/commit/77a8f23))
* **client:** client not being initialized ([#78](https://github.com/nuxt-community/sentry-module/issues/78)) ([a68f34b](https://github.com/nuxt-community/sentry-module/commit/a68f34b))

## [2.3.2](https://github.com/nuxt-community/sentry-module/compare/v2.3.1...v2.3.2) (2019-04-02)


### Bug Fixes

* fix module options ([#59](https://github.com/nuxt-community/sentry-module/issues/59)) ([9b4d723](https://github.com/nuxt-community/sentry-module/commit/9b4d723))



## [2.3.1](https://github.com/nuxt-community/sentry-module/compare/v2.3.0...v2.3.1) (2019-02-20)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/nuxt-community/sentry-module/compare/v2.0.0...v2.1.0) (2018-11-27)


### Bug Fixes

* change example of sentry command to valid ([6c9e862](https://github.com/nuxt-community/sentry-module/commit/6c9e862))


### Features

* add browser integrations ([8f11ea7](https://github.com/nuxt-community/sentry-module/commit/8f11ea7))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/nuxt-community/sentry-module/compare/v1.1.3...v2.0.0) (2018-10-19)


### Features

* use new sentry sdk, close [#20](https://github.com/nuxt-community/sentry-module/issues/20), [#30](https://github.com/nuxt-community/sentry-module/issues/30) ([da63340](https://github.com/nuxt-community/sentry-module/commit/da63340))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/nuxt-community/sentry-module/compare/v1.1.2...v1.1.3) (2018-09-10)


### Bug Fixes

* disabled option, fixes [#29](https://github.com/nuxt-community/sentry-module/issues/29) ([dbb2227](https://github.com/nuxt-community/sentry-module/commit/dbb2227))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/nuxt-community/sentry-module/compare/v1.1.1...v1.1.2) (2018-08-17)


### Features

* Add new option "disabled" ([0a8a047](https://github.com/nuxt-community/sentry-module/commit/0a8a047))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/nuxt-community/sentry-module/compare/v1.1.0...v1.1.1) (2018-07-12)


### Features

* add fallback for deprecated dns ([#24](https://github.com/nuxt-community/sentry-module/issues/24)) ([9f47f6a](https://github.com/nuxt-community/sentry-module/commit/9f47f6a))
* updated logging to use consola ([#25](https://github.com/nuxt-community/sentry-module/issues/25)) ([f6abcc8](https://github.com/nuxt-community/sentry-module/commit/f6abcc8))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/nuxt-community/sentry-module/compare/v1.0.3...v1.1.0) (2018-06-26)


### Features

* capture errors during nuxt generate ([129cb0f](https://github.com/nuxt-community/sentry-module/commit/129cb0f))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/nuxt-community/sentry-module/compare/v1.0.2...v1.0.3) (2018-03-22)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/nuxt-community/sentry-module/compare/v1.0.1...v1.0.2) (2018-03-18)


### Bug Fixes

* env bool now parsed as bool instead of string, close [#13](https://github.com/nuxt-community/sentry-module/issues/13) ([849e1e8](https://github.com/nuxt-community/sentry-module/commit/849e1e8))
* plugin is not loaded if no keys are provided, fix [#14](https://github.com/nuxt-community/sentry-module/issues/14) ([3e62730](https://github.com/nuxt-community/sentry-module/commit/3e62730))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/nuxt-community/sentry-module/compare/v1.0.0...v1.0.1) (2018-01-27)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/nuxt-community/sentry-module/compare/v0.2.0...v1.0.0) (2018-01-16)


### Features

* Support nuxt 1.0 new hook system ([85bf6d0](https://github.com/nuxt-community/sentry-module/commit/85bf6d0))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/nuxt-community/sentry-module/compare/v0.1.1...v0.2.0) (2017-12-13)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/nuxt-community/sentry-module/compare/v0.1.0...v0.1.1) (2017-11-28)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/nuxt-community/sentry-module/compare/v0.0.2...v0.1.0) (2017-10-24)


### Features

* more options ([cbca975](https://github.com/nuxt-community/sentry-module/commit/cbca975))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/nuxt-community/sentry-module/compare/v0.0.1...v0.0.2) (2017-10-17)
