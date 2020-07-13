// @ts-check

class ModulesOnMemberOf {
  /**
   * @param {EventEmitter} events
   * @param {EVENT_NAMES}  EVENT_NAMES
   */
  constructor(events, EVENT_NAMES) {
    events.on(EVENT_NAMES.commentsReady, this._fixModulesPaths.bind(this));
  }
  /**
   * @param {string} source
   * @returns {string}
   */
  _fixModulesPaths(source) {
    return source.replace(
      /^(\s+\*\s*@memberof!?\s*)(module\.)(?!exports[$\s])/gim,
      '$1module:',
    );
  }
}

module.exports.ModulesOnMemberOf = ModulesOnMemberOf;
