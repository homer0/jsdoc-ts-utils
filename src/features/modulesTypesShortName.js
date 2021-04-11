// @ts-check
/**
 * This class monkey-patches the function JSDoc uses to register links in order to create "aliases"
 * for external types and modules' types so they can be used without the `external:` and
 * `module:[name].` prefixes.
 * For example: `module:shared/apiClient.APIClient` would also register `APIClient`; and
 * `external:Express` would also register `Express`.
 */
class ModulesTypesShortName {
  /**
   * @param {EventEmitter}        events               To hook to the event triggered when
   *                                                   parsing begins.
   * @param {JSDocTemplateHelper} jsdocTemplateHelper  To monkey-patch the `registerLink`
   *                                                   function.
   * @param {EventNames}          EVENT_NAMES          To get the name of the event the
   *                                                   class needs to listen for.
   */
  constructor(events, jsdocTemplateHelper, EVENT_NAMES) {
    /**
     * A local reference for the JSDoc template helper, where the `registerLink` function
     * will be monkey-patched.
     *
     * @type {JSDocTemplateHelper}
     * @access protected
     * @ignore
     */
    this._jsdocTemplateHelper = jsdocTemplateHelper;
    // Setup the listener.
    events.on(EVENT_NAMES.parseBegin, this._monkyPatchRegisterLink.bind(this));
  }
  /**
   * This is called by the plugin before starting to parse the files; the method takes
   * care of validating if the `registerLink` function of the template helper was already
   * patched and patch it if it wasn't.
   *
   * @access protected
   * @ignore
   */
  _monkyPatchRegisterLink() {
    // Check if the function needs patching.
    if (!('monkey' in this._jsdocTemplateHelper.registerLink)) {
      // Get a reference for the original.
      const original = this._jsdocTemplateHelper.registerLink;
      /**
       * The patch.
       *
       * @type {JSDocTemplateHelperRegisterLink}
       * @ignore
       */
      const patch = (longname, fileUrl) => {
        // Call the original function.
        const result = original(longname, fileUrl);
        // Extract the short name.
        const match =
          /module:[^\.]+\.((?:[^\.]+\.)?[^\.]+)$/i.exec(longname) ||
          /external:([^\.]+)$/i.exec(longname);
        if (match) {
          // If a short name was found, register it.
          const [, shortname] = match;
          original(shortname, fileUrl);
        }

        // Return the original result.
        return result;
      };
      // Add the flag.
      // @ts-ignore
      patch.monkey = true;
      // Replace the function on the helper.
      this._jsdocTemplateHelper.registerLink = patch;
    }
  }
}

module.exports.ModulesTypesShortName = ModulesTypesShortName;
