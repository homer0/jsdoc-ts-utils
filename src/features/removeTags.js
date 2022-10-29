// @ts-check
/**
 * This class removes tag lines after a  `jsdoc-remove-next-tag` tag is found.
 */
class RemoveTags {
  /**
   * @param {EventEmitter} events       To hook to the necessary events to parse the code.
   * @param {EventNames}   EVENT_NAMES  To get the name of the events the class needs to
   *                                    listen for.
   */
  constructor(events, EVENT_NAMES) {
    /**
     * The list of comments that use `jsdoc-remove`.
     *
     * @type {string[]}
     * @access protected
     * @ignore
     */
    this._comments = [];
    /**
     * The expression that validates that the `jsdoc-remove-next-tag` tag is being used.
     * This expression is used on multiple places, that's why it's declared as a property.
     *
     * @type {RegExp}
     * @access protected
     * @ignore
     */
    this._removeExpression = /\s*\* @jsdoc-remove-next-tag\s*/;
    // Setup the listeners.
    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * This is called every time a new JSDoc comment block is found on a file. It validates
   * if the block uses `jsdoc-remove-next-tag` and saves it so it can be parsed later.
   *
   * @param {string} comment  The comment to analyze.
   * @access protected
   * @ignore
   */
  _readComment(comment) {
    if (comment.match(this._removeExpression)) {
      this._comments.push(comment);
    }
  }
  /**
   * This is called after all the JSDoc comments block for a file were found and the
   * plugin is ready to make changes.
   * The method takes all the comments that were found before and, if the comment includes
   * the `jsdoc-remove-next-tag` tag, it will remove the next lines until it finds a new
   * tag.
   *
   * @param {string} source  The code of the file being parsed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _replaceComments(source) {
    const result = this._comments.reduce((acc, comment) => {
      const lines = comment.split('\n');
      let removing = false;
      let removedAtLeastOneLine = false;
      /**
       * @type {string[]}
       */
      const newLinesAcc = [];
      const newLines = lines.reduce((sacc, line, index) => {
        if (index === lines.length - 1) {
          sacc.push(line);
          return sacc;
        }

        if (line.match(this._removeExpression)) {
          removing = true;
          removedAtLeastOneLine = false;
          return sacc;
        }

        if (removing && line.match(/^\s*\* @/)) {
          if (removedAtLeastOneLine) {
            removing = false;
          } else {
            removedAtLeastOneLine = true;
          }
        }

        if (!removing) {
          sacc.push(line);
        }

        return sacc;
      }, newLinesAcc);
      return acc.replace(comment, newLines.join('\n'));
    }, source);

    this._comments = [];
    return result;
  }
}

module.exports.RemoveTags = RemoveTags;
