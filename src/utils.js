// @ts-check
/**
 * @callback CommentsTraverseFn
 * @param {string} comment
 */

class Utils {
  /**
   * @param {string}  source
   * @param {CommentsTraverseFn}  fn
   */
  static traverseComments(source, fn) {
    const regex = /\/\*\*\s*\n(?:[^\*]|\*[^\/])*\*\//g;
    let match = regex.exec(source);
    while (match) {
      const [comment] = match;
      fn(comment);
      match = regex.exec(source);
    }
  }
}

module.exports.Utils = Utils;
