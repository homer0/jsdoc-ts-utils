// @ts-check

class TypedefImports {
  /**
   * @param {EventEmitter} events
   * @param {EVENT_NAMES} EVENT_NAMES
   */
  constructor(events, EVENT_NAMES) {
    /**
     * @type {string[]}
     * @access protected
     * @ignore
     */
    this._comments = [];
    /**
     * @typedef {RegExp}
     * @access protected
     * @ignore
     */
    this._importExpression = /\{\s*import\s*\(/i;
    /**
     * @typedef {RegExp}
     * @access protected
     * @ignore
     */
    this._externalExpression = /^\s*\*\s*@external\s+/mi;

    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * @param {string} comment
   */
  _readComment(comment) {
    if (comment.match(this._importExpression)) {
      this._comments.push(comment);
    }
  }
  /**
   * @param {string} source
   * @returns {string}
   */
  _replaceComments(source) {
    const result = this._comments.reduce(
      (acc, comment) => {
        let lines = comment.split('\n');
        if (comment.match(this._externalExpression)) {
          lines = lines.map((line) => (line.match(this._importExpression) ? ' * ' : line));
        } else {
          lines = lines.map(() => '');
        }

        return acc.replace(comment, lines.join('\n'));
      },
      source,
    );

    this._comments = [];
    return result;
  }
}

module.exports.TypedefImports = TypedefImports;
