// @ts-check
/* eslint-disable no-new */
const { EventEmitter } = require('events');
const jsdocEnv = require('jsdoc/lib/jsdoc/env');
const jsdocTemplateHelper = require('jsdoc/lib/jsdoc/util/templateHelper');
const { EVENT_NAMES } = require('./constants');
const features = require('./features');
/**
 * @type {TSUtilsOptions}
 */
const options = {
  typedefImports: true,
  extendTypes: true,
  modulesOnMemberOf: true,
  modulesTypesShortName: true,
  parentTag: true,
  typeScriptUtilityTypes: true,
  tagsReplacement: null,
  ...(jsdocEnv.conf.tsUtils || {}),
};

/**
 * @param {string}  source
 * @param {CommentsTraverseFn}  fn
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
 * @type {EventEmitter}
 */
const events = new EventEmitter();

if (options.typedefImports) {
  new features.TypedefImports(events, EVENT_NAMES);
}

if (options.extendTypes) {
  new features.ExtendTypes(events, EVENT_NAMES);
}

if (options.modulesOnMemberOf) {
  new features.ModulesOnMemberOf(events, EVENT_NAMES);
}

if (options.modulesTypesShortName) {
  new features.ModulesTypesShortName(
    events,
    jsdocTemplateHelper,
    EVENT_NAMES,
  );
}

if (options.parentTag) {
  new features.TagsReplacement(
    { parent: 'memberof' },
    events,
    EVENT_NAMES,
  );
}

if (options.typeScriptUtilityTypes) {
  new features.TSUtilitiesTypes(events, EVENT_NAMES);
}

if (options.tagsReplacement && Object.keys(options.tagsReplacement).length) {
  new features.TagsReplacement(
    options.tagsReplacement,
    events,
    EVENT_NAMES,
  );
}

module.exports.options = options;
module.exports.handlers = {
  parseBegin(event) {
    events.emit(EVENT_NAMES.parseBegin, event);
  },
  beforeParse(event) {
    const { source, filename } = event;
    traverseComments(source, (comment) => events.emit(
      EVENT_NAMES.newComment,
      comment,
      filename,
    ));

    // eslint-disable-next-line no-param-reassign
    event.source = events.listeners(EVENT_NAMES.commentsReady).reduce(
      (acc, listener) => listener(acc, filename),
      source,
    );
  },
};
