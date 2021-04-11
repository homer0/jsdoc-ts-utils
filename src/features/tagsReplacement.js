// @ts-check
/**
 * @typedef {Object.<string, string>} TagsReplacementDictionary
 */

/**
 * This class allows the replacement of JSDoc tags. For example, it can be used to replace all
 * `parent` tags with `memberof`.
 */
class TagsReplacement {
  /**
   * @param {TagsReplacementDictionary} dictionary   The dictionary of tags that need to
   *                                                 be replaced.
   * @param {EventEmitter}              events       To hook to the even triggered when
   *                                                 the plugin can do modifications to
   *                                                 the code.
   * @param {EventNames}                EVENT_NAMES  To get the name of the event the
   *                                                 class needs to listen for.
   */
  constructor(dictionary, events, EVENT_NAMES) {
    /**
     * The dictionary of tags that are going to be replaced.
     *
     * @type {TagsReplacementDictionary}
     * @access protected
     * @ignore
     */
    this._dictionary = dictionary;
    // Setup the listener.
    events.on(EVENT_NAMES.commentsReady, this._replaceTags.bind(this));
  }
  /**
   * This is called by the plugin in order replace the tags on a file.
   *
   * @param {string} source  The code of the file being parsed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _replaceTags(source) {
    return Object.entries(this._dictionary).reduce(
      (acc, [original, replacement]) =>
        acc.replace(
          new RegExp(`^(\\s+\\*\\s*@)${original}(\\s+)`, 'gim'),
          `$1${replacement}$2`,
        ),
      source,
    );
  }
}

module.exports.TagsReplacement = TagsReplacement;
