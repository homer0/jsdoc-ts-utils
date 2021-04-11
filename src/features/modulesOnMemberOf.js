// @ts-check
/**
 * This class replaces modules' paths on `memberof` statements that use dot notation in order to
 * make them JSDoc valid: `module.something` becomes `module:something`.
 */
class ModulesOnMemberOf {
  /**
   * @param {EventEmitter} events       To hook to the necessary events to parse the code.
   * @param {EventNames}   EVENT_NAMES  To get the name of the events the class needs to
   *                                    listen for.
   */
  constructor(events, EVENT_NAMES) {
    // Setup the listener.
    events.on(EVENT_NAMES.commentsReady, this._fixModulesPaths.bind(this));
  }
  /**
   * This is called by the plugin in order to fix the modules' paths.
   *
   * @param {string} source  The code of the file being parsed.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _fixModulesPaths(source) {
    return source.replace(
      /^(\s+\*\s*@memberof!?\s*)(module\.)(?!exports[$\s])/gim,
      '$1module:',
    );
  }
}

module.exports.ModulesOnMemberOf = ModulesOnMemberOf;
