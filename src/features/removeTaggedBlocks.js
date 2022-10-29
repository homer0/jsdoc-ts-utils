// @ts-check
/**
 * This class removes blocks that use the `jsdoc-remove` tag.
 */
class RemoveTaggedBlocks {
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
    // Setup the listeners.
    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * This is called every time a new JSDoc comment block is found on a file. It validates
   * if the block uses `jsdoc-remove` and saves it so it can be parsed later.
   *
   * @param {string} comment  The comment to analyze.
   * @access protected
   * @ignore
   */
  _readComment(comment) {
    if (comment.match(/\s*\* @jsdoc-remove\s*\*/)) {
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
    const result = this._comments.reduce(
      (acc, comment) =>
        acc.replace(
          comment,
          comment
            .split('\n')
            .map(() => '')
            .join('\n'),
        ),
      source,
    );

    this._comments = [];
    return result;
  }
}

module.exports.RemoveTaggedBlocks = RemoveTaggedBlocks;
