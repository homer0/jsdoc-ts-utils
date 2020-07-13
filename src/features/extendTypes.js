// @ts-check
/**
 * @typedef {Object} ExtendTypesCommentWithProperties
 * @property {string}   name
 * @property {string}   augments
 * @property {string}   comment
 * @property {number}   linesCount
 * @property {number}   usedLines
 * @property {string[]} lines
 */

class ExtendTypes {
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
    this._commentsWithIntersections = [];
    /**
     * @type {ExtendTypesCommentWithProperties[]}
     * @access protected
     * @ignore
     */
    this._commentsWithProperties = [];
    /**
     * @typedef {RegExp}
     * @access protected
     * @ignore
     */
    this._intersectionExpression = /\*\s*@typedef\s+\{\s*\w+\s*&\s*\w+/i;
    /**
     * @typedef {RegExp}
     * @access protected
     * @ignore
     */
    this._typeDefExpression = /\*\s*@typedef\s+\{/i;
    /**
     * @typedef {RegExp}
     * @access protected
     * @ignore
     */
    this._extendsTypeExpression = /\*\s*@(?:augments|extends)\s+\w+/i;
    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * @param {string} name
   * @param {string[]} types
   * @returns {?ExtendTypesCommentWithProperties}
   */
  _getCommentWithProperties(name, types) {
    const comments = types
    .map((type) => this._commentsWithProperties.find((comment) => (
      comment.name === type &&
      comment.augments === name
    )))
    .filter((comment) => comment);
    return comments.length === 1 ? comments[0] : null;
  }
  /**
   * @param {string} comment
   * @returns {ExtendTypesCommentWithProperties}
   */
  _getCommentWithPropertiesInfo(comment) {
    const [, name] = /@typedef\s+\{[^\}]+\}\s*(.*?)\s/i.exec(comment);
    const [, augments] = /@(?:augments|extends)\s+(.*?)\s/i.exec(comment);
    const allLines = comment.split('\n');
    const linesCount = allLines.length;
    const lines = allLines.filter((line) => (
      line.match(/\w/) &&
      !line.match(/^\s*\*\s*@(?:typedef|augments|extends)\s+/i)
    ));
    return {
      name: name.trim(),
      augments: augments.trim(),
      comment,
      linesCount,
      usedLines: 0,
      lines,
    };
  }
  /**
   * @param {string} comment
   */
  _readComment(comment) {
    if (comment.match(this._intersectionExpression)) {
      this._commentsWithIntersections.push(comment);
    } else if (
      comment.match(this._typeDefExpression) &&
      comment.match(this._extendsTypeExpression)
    ) {
      this._commentsWithProperties.push(this._getCommentWithPropertiesInfo(comment));
    }
  }
  /**
   * @param {string} source
   * @returns {string}
   */
  _removeCommentsWithProperties(source) {
    return this._commentsWithProperties.reduce(
      (acc, comment) => acc.replace(
        comment.comment,
        new Array(comment.linesCount - comment.usedLines).fill('').join('\n'),
      ),
      source,
    );
  }
  /**
   * @param {string} source
   * @returns {string}
   */
  _replaceComments(source) {
    let result = this._replaceDefinitions(source);
    result = this._removeCommentsWithProperties(result);
    this._commentsWithIntersections = [];
    this._commentsWithProperties = [];
    return result;
  }
  /**
   * @param {string} source
   * @returns {string}
   */
  _replaceDefinitions(source) {
    return this._commentsWithIntersections.reduce(
      (acc, comment) => {
        const [typedefLine, rawTypes, name] = /@typedef\s*\{([^\}]+)\}\s*(.*?)\s/i.exec(comment);
        const types = rawTypes
        .split('&')
        .map((type) => type.trim());

        let replacement;
        const commentWithProps = this._getCommentWithProperties(name, types);
        if (commentWithProps) {
          const [baseType] = types.filter((type) => type !== commentWithProps.name);
          const newTypedefLine = typedefLine.replace(rawTypes, baseType);
          const newComment = comment.replace(typedefLine, newTypedefLine);
          const lines = newComment.split('\n');
          const closingLine = lines.pop();
          const info = commentWithProps.lines.reduce(
            (infoAcc, line) => {
              let nextInfoAcc;
              if (infoAcc.lines.includes(line)) {
                nextInfoAcc = infoAcc;
              } else {
                nextInfoAcc = {
                  lines: [...infoAcc.lines, line],
                  count: infoAcc.count + 1,
                };
              }

              return nextInfoAcc;
            },
            {
              lines,
              count: commentWithProps.usedLines,
            },
          );
          info.lines.push(closingLine);
          replacement = info.lines.join('\n');
          commentWithProps.usedLines = info.count;
        } else {
          const newTypedefLine = typedefLine.replace(rawTypes, types.join('|'));
          replacement = comment.replace(typedefLine, newTypedefLine);
        }

        return acc.replace(comment, replacement);
      },
      source,
    );
  }
}

module.exports.ExtendTypes = ExtendTypes;
