## [2.0.1](https://github.com/homer0/jsdoc-ts-utils/compare/2.0.0...2.0.1) (2021-09-04)


### Bug Fixes

* update dependencies ([14e0200](https://github.com/homer0/jsdoc-ts-utils/commit/14e020042cd503fbd3111e35dd5b3d4d21ce8643))

# [2.0.0](https://github.com/homer0/jsdoc-ts-utils/compare/1.1.2...2.0.0) (2021-04-11)


### Bug Fixes

* drop support for Node 10 ([daf9f81](https://github.com/homer0/jsdoc-ts-utils/commit/daf9f8182c9da01a642599eeb93a55b40bb0c1ae))


### BREAKING CHANGES

* This package no longer supports Node 10.

## [1.1.2](https://github.com/homer0/jsdoc-ts-utils/compare/1.1.1...1.1.2) (2020-10-31)


### Bug Fixes

* **deps:** resolving the yarn problem in the CI ([d674e3b](https://github.com/homer0/jsdoc-ts-utils/commit/d674e3b2dfda80ebdd6b6e691db690b7a54f910d))

## [1.1.1](https://github.com/homer0/jsdoc-ts-utils/compare/1.1.0...1.1.1) (2020-08-24)


### Bug Fixes

* support multiline typedefs when extending a type ([8ecb515](https://github.com/homer0/jsdoc-ts-utils/commit/8ecb515f91fada146f492e8008d33701d49275e2))

# [1.1.0](https://github.com/homer0/jsdoc-ts-utils/compare/1.0.1...1.1.0) (2020-08-24)


### Bug Fixes

* update dependencies ([2eebbf9](https://github.com/homer0/jsdoc-ts-utils/commit/2eebbf9d5bb90e70de05d338edfeb2ce46c183e0))


### Features

* replace `typeof T` with `Class.<T>` ([9a5024e](https://github.com/homer0/jsdoc-ts-utils/commit/9a5024e128b918014c107f6ce0f48f9dacafae7f))

## [1.0.1](https://github.com/homer0/jsdoc-ts-utils/compare/1.0.0...1.0.1) (2020-08-11)


### Bug Fixes

* update dependencies ([f2d2152](https://github.com/homer0/jsdoc-ts-utils/commit/f2d2152ff4a5b7f5b77c732ceef93e3c31c3fcad))

# 1.0.0 (2020-07-14)


### Bug Fixes

* use the correct name for the JSDoc handler ([c0b94bd](https://github.com/homer0/jsdoc-ts-utils/commit/c0b94bdd8acc524fb5788c9c144012cc3f1b75f7))


### Code Refactoring

* rename the main file to index.js ([baefb79](https://github.com/homer0/jsdoc-ts-utils/commit/baefb79a996fc3c5c88e077da5330bb83a974625))


### Features

* add the extendTypes feature and its tests ([01294a0](https://github.com/homer0/jsdoc-ts-utils/commit/01294a0ee872d2acf4e7d6e43ccedb60e2abd8bc))
* add the modules path on memeberof feature and its tests ([80236dd](https://github.com/homer0/jsdoc-ts-utils/commit/80236ddc8db6f1718155a986e0eebfe47f9a18ae))
* add the modulesTypesShortName feature and its tests ([8d6d015](https://github.com/homer0/jsdoc-ts-utils/commit/8d6d015629b3c4fabac85501f5aef455777afd75))
* add the parent tag feature ([b28f247](https://github.com/homer0/jsdoc-ts-utils/commit/b28f247a76090b915758fa806e2869d1555acf81))
* add the plugin basic structure and the typedefImports feature ([cba9aca](https://github.com/homer0/jsdoc-ts-utils/commit/cba9acac56ccd41ecfebb97b8c7958061f27ab51))
* add the tags replacement feature and its tests ([7aaf9d0](https://github.com/homer0/jsdoc-ts-utils/commit/7aaf9d08c61f31b51c89fd3818e58ff520ed2e56))
* add the utility types feature and its tests ([734b90d](https://github.com/homer0/jsdoc-ts-utils/commit/734b90de93c2a02350f7aa3a8f970bfaef0ec254))
* release workflow ([c17a2e8](https://github.com/homer0/jsdoc-ts-utils/commit/c17a2e89d191887ba548a73898bdf11dd68f8b50))


### BREAKING CHANGES

* Now, by default, the plugin will look for the @parent tag and replace it with
@memberof
* The file src/plugin.js no longer exists
