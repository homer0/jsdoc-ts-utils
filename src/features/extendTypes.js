// @ts-check
/**
 * @typedef {Object} ExtendTypesCommentWithProperties
 * @property {string}   name        The name of the type.
 * @property {string}   augments    The name of the type it extends.
 * @property {string}   comment     The raw comment.
 * @property {number}   linesCount  How many lines the comment has.
 * @property {string[]} lines       The list of lines from the comment that can be used on
 *                                  the type that it's being extended.
 * @property {number}   usedLines   This counter gets modified during parsing and it
 *                                  represents how many of the `lines` were used: if the
 *                                  type with the intersection already has one line, it's
 *                                  not added, but the class needs to know how many lines
 *                                  it needs to use to replace the comment when removed.
 * @ignore
 */

/**
 * This class allows the use of intersection types in oder to define types extensions by
 * transforming the code in two ways:
 * 1. If one of the types of the intersection uses `augments`/`extends` for the intersection type,
 * all its "lines" are moved to the intersection type and it gets removed.
 * 2. If the first scenario is not possible, it trasforms `&` into `|`. Yes, it becomes a union
 * type, but it's as closer as we can get with pure JSDoc.
 */
class ExtendTypes {
  /**
   * @param {EventEmitter} events       To hook to the necessary events to parse the code.
   * @param {EventNames}   EVENT_NAMES  To get the name of the events the class needs to
   *                                    listen for.
   */
  constructor(events, EVENT_NAMES) {
    /**
     * The list of comments that use intersections on a `typedef` statements.
     *
     * @type {string[]}
     * @access protected
     * @ignore
     */
    this._commentsWithIntersections = [];
    /**
     * A list with the information of comments that extend/agument types with
     * intersections.
     *
     * @type {ExtendTypesCommentWithProperties[]}
     * @access protected
     * @ignore
     */
    this._commentsWithProperties = [];
    // Setup the listeners.
    events.on(EVENT_NAMES.newComment, this._readComment.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._replaceComments.bind(this));
  }
  /**
   * Given a list of types from an instersection definition, this methods tries to find a
   * comment that extends one of those types.
   * If the method finds only one comment for a type, it returns it, otherwise, it returns
   * `null`:
   * the class only supports extending one type.
   *
   * @param {string}   name   The name of the type that uses intersection.
   * @param {string[]} types  The list of types in the intersection.
   * @returns {?ExtendTypesCommentWithProperties}
   * @access protected
   * @ignore
   */
  _getCommentWithProperties(name, types) {
    const comments = types
      .map((type) =>
        this._commentsWithProperties.find(
          (comment) => comment.name === type && comment.augments === name,
        ),
      )
      .filter((comment) => comment);
    return comments.length === 1 ? comments[0] : null;
  }
  /**
   * Parses a JSDock comment block for a type definition that extends a type with
   * intersection.
   *
   * @param {string} comment  The raw comment to parse.
   * @returns {ExtendTypesCommentWithProperties}
   * @access protected
   * @ignore
   */
  _getCommentWithPropertiesInfo(comment) {
    const [, name] = /@typedef\s+\{[^\}]+\}[\s\*]*(.*?)\s/i.exec(comment);
    const [, augments] = /@(?:augments|extends)\s+(.*?)\s/i.exec(comment);
    const allLines = comment.split('\n');
    const linesCount = allLines.length;
    const lines = allLines.filter(
      (line) =>
        line.match(/\w/) && !line.match(/^\s*\*\s*@(?:typedef|augments|extends)\s+/i),
    );
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
   * This is called every time a new JSDoc comment block is found on a file. It validates
   * if the block uses intersection or if it's a `typedef` that extends another type in
   * order to save it to be parsed later.
   *
   * @param {string} comment  The comment to analyze.
   * @access protected
   * @ignore
   */
  _readComment(comment) {
    if (comment.match(/\*\s*@typedef\s+\{\s*\w+\s*&\s*\w+/i)) {
      this._commentsWithIntersections.push(comment);
    } else if (
      comment.match(/\*\s*@typedef\s+\{/i) &&
      comment.match(/\*\s*@(?:augments|extends)\s+\w+/i)
    ) {
      this._commentsWithProperties.push(this._getCommentWithPropertiesInfo(comment));
    }
  }
  /**
   * Replaces the JSDoc comment blocks for type definitions that extend types with
   * intersections with empty lines.
   *
   * @param {string} source  The code of the file where the comments should be removed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _removeCommentsWithProperties(source) {
    return this._commentsWithProperties.reduce(
      (acc, comment) =>
        acc.replace(
          comment.comment,
          new Array(comment.linesCount - comment.usedLines).fill('').join('\n'),
        ),
      source,
    );
  }
  /**
   * This is called after all the JSDoc comments block for a file were found and the
   * plugin is ready to make changes.
   * The method first _"fixes"_ the `typedef` statements with intersections and then
   * removes the comments for types that extend another types.
   *
   * @param {string} source  The code of the file being parsed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _replaceComments(source) {
    let result = this._replaceDefinitions(source);
    result = this._removeCommentsWithProperties(result);
    this._commentsWithIntersections = [];
    this._commentsWithProperties = [];
    return result;
  }
  /**
   * Parses the comments with intersections, validate if there's a type extending them
   * from where they can take "lines", or if they should be transformed into unions.
   *
   * @param {string} source  The code of the file where the comments should be replaced.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _replaceDefinitions(source) {
    return this._commentsWithIntersections.reduce((acc, comment) => {
      // Extract the `typedef` types and name.
      const [typedefLine, rawTypes, name] = /@typedef\s*\{([^\}]+)\}[\s\*]*(.*?)\s/i.exec(
        comment,
      );
      // Transform the types into an array.
      const types = rawTypes.split('&').map((type) => type.trim());

      let replacement;
      // Try to find a type that extends this one.
      const commentWithProps = this._getCommentWithProperties(name, types);
      if (commentWithProps) {
        // If there was a type extending it...
        // Find the "real type" that it's being extended.
        const [baseType] = types.filter((type) => type !== commentWithProps.name);
        // Remove the intersection and leave just the "real type"
        const newTypedefLine = typedefLine.replace(rawTypes, baseType);
        // Replace the `typedef` with the new one, with the "real type".
        const newComment = comment.replace(typedefLine, newTypedefLine);
        // Transform the comment into an array of lines.
        const lines = newComment.split('\n');
        // Remove the line with `*/` so new lines can be added.
        const closingLine = lines.pop();
        /**
         * For each line of the type that extends the definition, check if it doesn't
         * already exists on the comment (this can happen with `access` or `memberof`
         * statements),
         * and if it doesn't, it not only adds it but it also increments the counter that
         * tracks how many lines of the comment are being used.
         *
         * The lines that are moved are counted so the class can later replace the comment
         * with enough empty lines so it won't mess up the line number of the rest of the
         * types.
         * For example: If we had a type with intersection with a single line, a type that
         * extends it with 3 lines lines with `property` and one with `access`
         * (plus the `typedef` and the `extends`/`augments`) and the intersection type
         * already has `access`, the class would replace the comment with `5` empty lines.
         * The comment had a total of 8 lines, 3 `property`, `typedef`,
         * `extends`/`augments`, `access` and the opening and closing lines; but the
         * properties were moved to another type.
         *
         * @ignore
         */
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
        // Add the closing line and put the comment back together.
        info.lines.push(closingLine);
        replacement = info.lines.join('\n');
        // Update the counter with the used lines.
        commentWithProps.usedLines = info.count;
      } else {
        // No comment was found, so transform the intersection into a union.
        const newTypedefLine = typedefLine.replace(rawTypes, types.join('|'));
        replacement = comment.replace(typedefLine, newTypedefLine);
      }

      return acc.replace(comment, replacement);
    }, source);
  }
}

module.exports.ExtendTypes = ExtendTypes;
