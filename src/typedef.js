/**
 * @typedef {import('events').EventEmitter} EventEmitter
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html
 */

/**
 * @typedef {import('jsdoc/lib/jsdoc/util/templateHelper')} JSDocTemplateHelper
 * @external JSDocTemplateHelper
 * @see https://github.com/jsdoc/jsdoc/blob/3.5.5/lib/jsdoc/util/templateHelper.js
 */

/* eslint-disable jsdoc/valid-types, max-len */
/**
 * @typedef {import('jsdoc/lib/jsdoc/util/templateHelper')['registerLink']}
 * JSDocTemplateHelperRegisterLink
 *
 * @prettierignore
 */
/* eslint-enable jsdoc/valid-types */

/**
 * @typedef {import('./constants').EventNames} EventNames
 */

/**
 * @typedef {Object} TSUtilsOptions
 * @property {boolean} typedefImports
 * Whether or not to enable the feature that removes `typedef` statements that use
 * `import`.
 * Default `true`.
 * @property {boolean} typeOfTypes
 * Whether or not to enable the feature that replaces `{typeof T}` with `{Class.<T>}`.
 * Default `true`.
 * @property {boolean} extendTypes
 * Whether or not to enable the feature that allows intersections to be reformatted.
 * Default `true`.
 * @property {boolean} modulesOnMemberOf
 * Whether or not to enable the feature that fixes modules' paths on `memeberof` so they
 * can use dot notation. Default `true`.
 * @property {boolean} modulesTypesShortName
 * Whether or not to register modules types without the module path too. Default `true`.
 * @property {boolean} parentTag
 * Whether or not to transform all `parent` tags into `memberof`. Default `true`.
 * @property {boolean} typeScriptUtilityTypes
 * Whether or not to add the external utility types from TypeScript. Default `true`.
 * @property {?Object.<string, string>} tagsReplacement
 * A dictionary of tags to replace, they keys are the tags being used and the values the
 * tag that should be used. Default `null`.
 */

/**
 * @typedef {Object} JSDocParseBeginEventPayload
 * @property {string[]} sourcefiles  The list of files JSDoc will parse.
 * @ignore
 */

/**
 * @callback JSDocParseBeginHandler
 * @param {JSDocParseBeginEventPayload} event  The JSDoc event information.
 * @ignore
 */

/**
 * @typedef {Object} JSDocBeforeParseEventPayload
 * @property {string} source    The source code of the file that is going to be parsed.
 * @property {string} filename  The absolute path to the file that is going to be parsed.
 * @ignore
 */

/**
 * @callback JSDocBeforeParseHandler
 * @param {JSDocBeforeParseEventPayload} event  The JSDoc event information.
 * @ignore
 */

/**
 * @typedef {Object} JSDocPluginHandlers
 * @property {JSDocParseBeginHandler}  parseBegin   Called before parsing the files.
 * @property {JSDocBeforeParseHandler} beforeParse  Called before parsing a single file.
 * @ignore
 */
