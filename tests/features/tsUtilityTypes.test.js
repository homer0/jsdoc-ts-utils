jest.unmock('../../src/features/tsUtilityTypes');
const { TSUtilitiesTypes } = require('../../src/features/tsUtilityTypes');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:tsUtilityTypes', () => {
  const EXTERNALS_COMMENT = [
    '/**',
    ' * @external Partial',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt',
    ' */\n',
    '/**',
    ' * @external Readonly',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlyt',
    ' */\n',
    '/**',
    ' * @external Record',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkt',
    ' */\n',
    '/**',
    ' * @external Pick',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#picktk',
    ' */\n',
    '/**',
    ' * @external Omit',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#omittk',
    ' */\n',
    '/**',
    ' * @external Exclude',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetu',
    ' */\n',
    '/**',
    ' * @external Extract',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttu',
    ' */\n',
    '/**',
    ' * @external NonNullable',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullablet',
    ' */\n',
    '/**',
    ' * @external Parameters',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterst',
    ' */\n',
    '/**',
    ' * @external ConstructorParameters',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterst',
    ' */\n',
    '/**',
    ' * @external ReturnType',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypet',
    ' */\n',
    '/**',
    ' * @external InstanceType',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypet',
    ' */\n',
    '/**',
    ' * @external Required',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredt',
    ' */\n',
    '/**',
    ' * @external ThisParameterType',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertype',
    ' */\n',
    '/**',
    ' * @external OmitThisParameter',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#omitthisparameter',
    ' */\n',
    '/**',
    ' * @external ThisType',
    ' * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet',
    ' */\n',
  ].join('\n');

  it('should register the listeners when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new TSUtilitiesTypes(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(TSUtilitiesTypes);
    expect(events.on).toHaveBeenCalledTimes(2);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.parseBegin, expect.any(Function));
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.commentsReady, expect.any(Function));
  });

  it('should add the types on a typedef.js file', () => {
    // Given
    const otherFile = {
      path: 'some/other/path/index.js',
      contents: 'throw new Error(\'we are doomed\');',
    };
    const typedefFile = {
      path: 'some/path/typedef.js',
      contents: '/** @typedef {Object} Something */',
    };
    const files = [otherFile, typedefFile];
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onParseBegin = null;
    let onCommentsReady = null;
    let results = null;
    // When
    sut = new TSUtilitiesTypes(events, EVENT_NAMES);
    [[, onParseBegin], [, onCommentsReady]] = events.on.mock.calls;
    onParseBegin({
      sourcefiles: files.map((file) => file.path),
    });
    results = files.map((file) => onCommentsReady(
      file.contents,
      file.path,
    ));
    // Then
    expect(sut).toBeInstanceOf(TSUtilitiesTypes);
    expect(results).toEqual([
      otherFile.contents,
      `${typedefFile.contents}\n\n${EXTERNALS_COMMENT}`,
    ]);
  });

  it('should add the types on the first file if there\'s no typedef.js', () => {
    // Given
    const typedefFile = {
      path: 'some/path/index.js',
      contents: '/** @typedef {Object} Something */',
    };
    const otherFile = {
      path: 'some/other/path/index.js',
      contents: 'throw new Error(\'we are doomed\');',
    };
    const files = [typedefFile, otherFile];
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onParseBegin = null;
    let onCommentsReady = null;
    let results = null;
    // When
    sut = new TSUtilitiesTypes(events, EVENT_NAMES);
    [[, onParseBegin], [, onCommentsReady]] = events.on.mock.calls;
    onParseBegin({
      sourcefiles: files.map((file) => file.path),
    });
    results = files.map((file) => onCommentsReady(
      file.contents,
      file.path,
    ));
    // Then
    expect(sut).toBeInstanceOf(TSUtilitiesTypes);
    expect(results).toEqual([
      `${typedefFile.contents}\n\n${EXTERNALS_COMMENT}`,
      otherFile.contents,
    ]);
  });
});
