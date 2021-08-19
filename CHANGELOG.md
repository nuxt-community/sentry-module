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
