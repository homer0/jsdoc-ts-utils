// @ts-check
/**
 * @typedef {Object} EventNames
 * @property {string} parseBegin     The event triggered before the files are parsed.
 * @property {string} newComment     The event triggered when the plugin finds a new JSDoc
 *                                   comment.
 * @property {string} commentsReady  The event triggered when all the comments were
 *                                   analyzed and the features should start making
 *                                   modifications to the code.
 */

/**
 * A dictionary with the different events the plugin uses.
 *
 * @type {EventNames}
 * @ignore
 */
const EVENT_NAMES = {
  parseBegin: 'jsdoc:parse-begin',
  newComment: 'ts-utils:new-comment',
  commentsReady: 'ts-utils:comments-ready',
};

module.exports.EVENT_NAMES = EVENT_NAMES;
