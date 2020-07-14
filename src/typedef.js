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
 * @typedef {import('jsdoc/lib/jsdoc/util/templateHelper')['registerLink']} JSDocTemplateHelperRegisterLink
 */
/* eslint-enable jsdoc/valid-types */

/**
 * @typedef {import('./constants').EVENT_NAMES} EVENT_NAMES
 */

/**
 * @typedef {Object} TSUtilsOptions
 * @property {boolean} [typedefImports=true]
 * Whether or not to enable the feature that removes `typedef` statements that use `import`.
 * @property {boolean} [extendTypes=true]
 * Whether or not to enable the feature that allows intersections to be reformatted.
 * @property {boolean} [modulesOnMemberOf=true]
 * Whether or not to enable the feature that fixes modules' paths on `memeberof` so they can
 * use dot notation.
 * @property {boolean} [modulesTypesShortName=true]
 * Whether or not to register modules types without the module path too.
 * @property {boolean} [parentTag=true]
 * Whether or not to transform all `parent` tags into `memberof`.
 * @property {boolean} [typeScriptUtilityTypes=true]
 * Whether or not to add the external utility types from TypeScript.
 * @property {?Object.<string,string>} [tagsReplacement=null]
 * A dictionary of tags to replace, they keys are the tags being used and the values the tag that
 * should be used.
 */

/**
 * @typedef {Object} JSDocParseBeginEventPayload
 * @property {string[]} sourcefiles The list of files JSDoc will parse.
 * @ignore
 */

/**
 * @callback JSDocParseBeginHandler
 * @param {JSDocParseBeginEventPayload} event The JSDoc event information.
 * @ignore
 */

/**
 * @typedef {Object} JSDocBeforeParseEventPayload
 * @property {string} source   The source code of the file that is going to be parsed.
 * @property {string} filename The absolute path to the file that is going to be parsed.
 * @ignore
 */

/**
 * @callback JSDocBeforeParseHandler
 * @param {JSDocBeforeParseEventPayload} event The JSDoc event information.
 * @ignore
 */

/**
 * @typedef {Object} JSDocPluginHandlers
 * @property {JSDocParseBeginHandler}  parseBegin  Called before parsing the files.
 * @property {JSDocBeforeParseHandler} beforeParse Called before parsing a single file.
 * @ignore
 */
