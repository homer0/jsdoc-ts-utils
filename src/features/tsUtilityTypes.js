// @ts-check
const path = require('path');

class TSUtilitiesTypes {
  /**
   * @param {EventEmitter} events
   * @param {EVENT_NAMES} EVENT_NAMES
   */
  constructor(events, EVENT_NAMES) {
    this._typedefFile = null;
    this._added = false;
    this._typesUrl = 'https://www.typescriptlang.org/docs/handbook/utility-types.html';
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
    events.on(EVENT_NAMES.parseBegin, this._findTypedefFile.bind(this));
    events.on(EVENT_NAMES.commentsReady, this._addTypes.bind(this));
  }
  /**
   * @param {string} source
   * @param {string} filename
   * @returns {string}
   */
  _addTypes(source, filename) {
    let result;
    if (
      this._added ||
      (this._typedefFile && filename !== this._typedefFile)
    ) {
      result = source;
    } else {
      const comments = this._getComments();
      result = `${source}\n\n${comments}`;
      this._added = true;
    }

    return result;
  }
  /**
   * @param {Object}   event
   * @param {string[]} event.sourcefiles
   */
  _findTypedefFile(event) {
    const typedef = event.sourcefiles.find((file) => (
      path
      .basename(file)
      .match(/^typedef\.[jt]sx?$/)
    ));

    this._typedefFile = typedef || null;
    this._added = false;
  }
  /**
   * @returns {string}
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
