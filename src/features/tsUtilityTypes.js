// @ts-check
const path = require('path');

/**
 * This class adds extra type definitions for TypeScript utility types. If the project includes
 * a `typedef` file, the definitions will be added at the end of the file; otherwise, they'll be
 * added to the first file being parsed.
 */
class TSUtilitiesTypes {
  /**
   * @param {EventEmitter} events       To hook to the necessary events to add the
   *                                    definitions.
   * @param {EventNames}   EVENT_NAMES  To get the name of the events the class needs to
   *                                    listen for.
   */
  constructor(events, EVENT_NAMES) {
    /**
     * If a `typedef` file is found, this property will have its path.
     *
     * @type {?string}
     * @access protected
     * @ignore
     */
    this._typedefFile = null;
    /**
     * A control flag used when parsing the files in order to know if the defintions were
     * already added or not.
     *
     * @type {boolean}
     * @access protected
     * @ignore
     */
    this._added = false;
    /**
     * The base URL of where the types are documented.
     *
     * @type {string}
     * @access protected
     * @ignore
     */
    this._typesUrl = 'https://www.typescriptlang.org/docs/handbook/utility-types.html';
    /**
     * The dictionary of the utility types. The keys are the names of the types and the
     * values their anchor section on the documentation page.
     *
     * @type {Object.<string, string>}
     * @access protected
     * @ignore
     */
    this._types = {
      Partial: 'partialt',
      Readonly: 'readonlyt',
      Record: 'recordkt',
      Pick: 'picktk',
      Omit: 'omittk',
      Exclude: 'excludetu',
      Extract: 'extracttu',
      NonNullable: 'nonnullablet',
      Parameters: 'parameterst',
      ConstructorParameters: 'constructorparameterst',
      ReturnType: 'returntypet',
      InstanceType: 'instancetypet',
      Required: 'requiredt',
      ThisParameterType: 'thisparametertype',
      OmitThisParameter: 'omitthisparameter',
      ThisType: 'thistypet',
    };
    // Setup the listeners.
    events.on(EVENT_NAMES.parseBegin, this._findTypedefFile.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._addTypes.bind(this));
  }
  /**
   * This is called by the plugin in order to add the types.
   *
   * @param {string} source    The code of the file being parsed.
   * @param {string} filename  The path of the file being parsed. This is used in case a
   *                           `typedef`
   *                           file exists on the project, to validate if the comments
   *                           should be added on that file.
   * @returns {string}
   * @access protected
   * @ignore
   */
  _addTypes(source, filename) {
    let result;
    if (this._added || (this._typedefFile && filename !== this._typedefFile)) {
      result = source;
    } else {
      const comments = this._getComments();
      result = `${source}\n\n${comments}`;
      this._added = true;
    }

    return result;
  }
  /**
   * This is called by the plugin before the parsing beings, so the class can identify if
   * the project includes a `typedef` file.
   *
   * @param {JSDocParseBeginEventPayload} event  The event information, with the list of
   *                                             files that going to be parsed.
   */
  _findTypedefFile(event) {
    const typedef = event.sourcefiles.find((file) =>
      path.basename(file).match(/^typedef\.[jt]sx?$/),
    );

    this._typedefFile = typedef || null;
    this._added = false;
  }
  /**
   * Generates the `typedef` blocks for the TypeScript utility types.
   *
   * @returns {string}
   * @access protected
   * @ignore
   */
  _getComments() {
    return Object.entries(this._types)
      .map(([name, anchor]) => [
        '/**',
        ` * @external ${name}`,
        ` * @see ${this._typesUrl}#${anchor}`,
        ' */\n',
      ])
      .reduce((acc, lines) => [...acc, ...lines], [])
      .join('\n');
  }
}

module.exports.TSUtilitiesTypes = TSUtilitiesTypes;
