// @ts-check
/* eslint-disable no-new */
const { EventEmitter } = require('events');
const jsdocEnv = require('jsdoc/lib/jsdoc/env');
const jsdocTemplateHelper = require('jsdoc/lib/jsdoc/util/templateHelper');
const { EVENT_NAMES } = require('./constants');
const features = require('./features');

/**
 * @callback CommentsTraverseFn
 * @param {string} comment
 * @ignore
 */

/**
 * Finds all the JSDoc comments on a source and _walks_ them by calling the traverse
 * function.
 *
 * @param {string}             source  The code to analyze.
 * @param {CommentsTraverseFn} fn      The function that will be called for each comment.
 * @ignore
 */
const traverseComments = (source, fn) => {
  const regex = /\/\*\*\s*\n(?:[^\*]|\*[^\/])*\*\//g;
  let match = regex.exec(source);
  while (match) {
    const [comment] = match;
    fn(comment);
    match = regex.exec(source);
  }
};

/**
 * The plugin options.
 *
 * @type {TSUtilsOptions}
 * @ignore
 */
const options = {
  typedefImports: true,
  typeOfTypes: true,
  extendTypes: true,
  modulesOnMemberOf: true,
  modulesTypesShortName: true,
  parentTag: true,
  typeScriptUtilityTypes: true,
  tagsReplacement: null,
  ...(jsdocEnv.conf.tsUtils || {}),
};

/**
 * @type {EventEmitter}
 * @ignore
 */
const events = new EventEmitter();

// Load the features..
if (options.typedefImports) {
  new features.TypedefImports(events, EVENT_NAMES);
}

if (options.typeOfTypes) {
  new features.TypeOfTypes(events, EVENT_NAMES);
}

if (options.extendTypes) {
  new features.ExtendTypes(events, EVENT_NAMES);
}

if (options.modulesOnMemberOf) {
  new features.ModulesOnMemberOf(events, EVENT_NAMES);
}

if (options.modulesTypesShortName) {
  new features.ModulesTypesShortName(events, jsdocTemplateHelper, EVENT_NAMES);
}

if (options.parentTag) {
  new features.TagsReplacement({ parent: 'memberof' }, events, EVENT_NAMES);
}

if (options.typeScriptUtilityTypes) {
  new features.TSUtilitiesTypes(events, EVENT_NAMES);
}

if (options.tagsReplacement && Object.keys(options.tagsReplacement).length) {
  new features.TagsReplacement(options.tagsReplacement, events, EVENT_NAMES);
}
/**
 * Export all the loaded optiones.
 *
 * @type {TSUtilsOptions}
 * @ignore
 */
module.exports.options = options;
/**
 * Export the handlers for JSDoc.
 *
 * @type {JSDocPluginHandlers}
 * @ignore
 */
module.exports.handlers = {
  parseBegin(event) {
    events.emit(EVENT_NAMES.parseBegin, event);
  },
  beforeParse(event) {
    const { source, filename } = event;
    traverseComments(source, (comment) =>
      events.emit(EVENT_NAMES.newComment, comment, filename),
    );

    // eslint-disable-next-line no-param-reassign
    event.source = events
      .listeners(EVENT_NAMES.commentsReady)
      .reduce((acc, listener) => listener(acc, filename), source);
  },
};
