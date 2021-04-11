// @ts-check
/**
 * This class takes care of removing blocks of JSDoc comments that use `typedef` statements with
 * `import(...)`.
 */
class TypedefImports {
  /**
   * @param {EventEmitter} events       To hook to the necessary events to parse the code.
   * @param {EventNames}   EVENT_NAMES  To get the name of the events the class needs to
   *                                    listen for.
   */
  constructor(events, EVENT_NAMES) {
    /**
     * The list of comments that use `typedef` with `import(...)`.
     *
     * @type {string[]}
     * @access protected
     * @ignore
     */
    this._comments = [];
    /**
     * The expression that validates that `import(...)` is being used inside a `typedef`
     * statement.
     * This expression is used on multiple places, that's why it's declared as a property.
     *
     * @type {RegExp}
     * @access protected
     * @ignore
     */
    this._importExpression = /\{\s*import\s*\(/i;
    // Setup the listeners.
    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * This is called every time a new JSDoc comment block is found on a file. It validates
   * if the block uses `import(...)` and saves it so it can be parsed later.
   *
   * @param {string} comment  The comment to analyze.
   * @access protected
   * @ignore
   */
  _readComment(comment) {
    if (comment.match(this._importExpression)) {
      this._comments.push(comment);
    }
  }
  /**
   * This is called after all the JSDoc comments block for a file were found and the
   * plugin is ready to make changes.
   * The method takes all the comments that were found before and, if the comment includes
   * an `external` statement, it just replaces the `typedef` line with an empty one; but
   * if it doesn't, it gets replaced with empty lines.
   *
   * @param {string} source  The code of the file being parsed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _replaceComments(source) {
    const result = this._comments.reduce((acc, comment) => {
      let lines = comment.split('\n');
      if (comment.match(/^\s*\*\s*@external\s+/im)) {
        lines = lines.map((line) => (line.match(this._importExpression) ? ' * ' : line));
      } else {
        lines = lines.map(() => '');
      }

      return acc.replace(comment, lines.join('\n'));
    }, source);

    this._comments = [];
    return result;
  }
}

module.exports.TypedefImports = TypedefImports;
