/**
 * @typedef {import('events').EventEmitter} EventEmitter
 * @typedef {import('./constants')['EVENT_NAMES']} EVENT_NAMES
 * @typedef {import('jsdoc/lib/jsdoc/util/templateHelper')} JSDocTemplateHelper
 */

/**
 * @callback CommentsTraverseFn
 * @param {string} comment
 */

/**
 * @typedef {Object} TSUtilsOptions
 * @property {boolean} [typedefImports=true]
 * @property {boolean} [extendTypes=true]
 * @property {boolean} [modulesOnMemberOf=true]
 * @property {boolean} [modulesTypesShortName=true]
 * @property {boolean} [typeScriptUtilityTypes=true]
 * @property {?Object.<string,string>} [tagsReplacement=null]
 */
