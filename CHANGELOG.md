# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
