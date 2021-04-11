// @ts-check
/**
 * This class takes care of fixing JSDoc comments that use `typeof T` as a type and replace it with
 * `Class.<T>`.
 */
class TypeOfTypes {
  /**
   * @param {EventEmitter} events       To hook to the necessary events to parse the code.
   * @param {EventNames}   EVENT_NAMES  To get the name of the events the class needs to
   *                                    listen for.
   */
  constructor(events, EVENT_NAMES) {
    /**
     * The list of comments that use `typeof` on a type.
     *
     * @type {string[]}
     * @access protected
     * @ignore
     */
    this._comments = [];
    // Setup the listeners.
    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * This is called every time a new JSDoc comment block is found on a file. It validates
   * if the block uses `typeof` as a type and saves it so it can be parsed later.
   *
   * @param {string} comment  The comment to analyze.
   * @access protected
   * @ignore
   */
  _readComment(comment) {
    if (comment.match(/\{\s*typeof\s+\w+\s*}/i)) {
      this._comments.push(comment);
    }
  }
  /**
   * This is called after all the JSDoc comments block for a file were found and the
   * plugin is ready to make changes.
   * The method takes all the comments that were found before and, if the comment includes
   * a `typeof` on a type, it replaces it with `Class.<Type>`.
   *
   * @param {string} source  The code of the file being parsed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _replaceComments(source) {
    const result = this._comments.reduce(
      (acc, comment) =>
        acc.replace(
          comment,
          comment.replace(/\{\s*typeof\s+(\w+)\s*}/gi, '{Class.<$1>}'),
        ),
      source,
    );

    this._comments = [];
    return result;
  }
}

module.exports.TypeOfTypes = TypeOfTypes;
