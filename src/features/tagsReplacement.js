// @ts-check

/**
 * @typedef {Object.<string,string>} TagsReplacementDictionary
 */

class TagsReplacement {
  /**
   * @param {TagsReplacementDictionary} dictionary
   * @param {EventEmitter} events
   * @param {EVENT_NAMES} EVENT_NAMES
   */
  constructor(dictionary, events, EVENT_NAMES) {
    /**
     * @type {TagsReplacementDictionary}
     * @access protected
     * @ignore
     */
    this._dictionary = dictionary;

    events.on(EVENT_NAMES.commentsReady, this._replaceTags.bind(this));
  }
  /**
   * @param {string} source
   * @returns {string}
   */
  _replaceTags(source) {
    return Object.entries(this._dictionary).reduce(
      (acc, [original, replacement]) => acc.replace(
        new RegExp(`^(\\s+\\*\\s*@)${original}(\\s+)`, 'gim'),
        `$1${replacement}$2`,
      ),
      source,
    );
  }
}

module.exports.TagsReplacement = TagsReplacement;
