// @ts-check

class ModulesTypesShortName {
  /**
   * @param {EventEmitter} events
   * @param {JSDocTemplateHelper} jsdocTemplateHelper
   * @param {EVENT_NAMES} EVENT_NAMES
   */
  constructor(events, jsdocTemplateHelper, EVENT_NAMES) {
    this._jsdocTemplateHelper = jsdocTemplateHelper;
    events.on(EVENT_NAMES.parseBegin, this._monkyPatchRegisterLink.bind(this));
  }
  _monkyPatchRegisterLink() {
    if (!('monkey' in this._jsdocTemplateHelper.registerLink)) {
      /**
       * @type {JSDocTemplateHelper['registerLink']}
       */
      const original = this._jsdocTemplateHelper.registerLink;
      /**
       * @type {JSDocTemplateHelper['registerLink']}
       */
      const patch = (longname, fileUrl) => {
        const result = original(longname, fileUrl);
        const match = /module:[^\.]+\.((?:[^\.]+\.)?[^\.]+)$/i.exec(longname) ||
          /external:([^\.]+)$/i.exec(longname);
        if (match) {
          const [, shortname] = match;
          original(shortname, fileUrl);
        }

        return result;
      };
      // @ts-ignore
      patch.monkey = true;
      this._jsdocTemplateHelper.registerLink = patch;
    }
  }
}

module.exports.ModulesTypesShortName = ModulesTypesShortName;
