jest.mock('jsdoc/lib/jsdoc/util/templateHelper', () => ({}));
jest.unmock('../../src/features/modulesTypesShortName');
const jsdocTemplateHelper = require('jsdoc/lib/jsdoc/util/templateHelper');
const { ModulesTypesShortName } = require('../../src/features/modulesTypesShortName');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:modulesTypesShortName', () => {
  let registerLinkMock;

  beforeEach(() => {
    registerLinkMock = jest.fn();
    jsdocTemplateHelper.registerLink = registerLinkMock;
  });

  it('should register the listener when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new ModulesTypesShortName(events, jsdocTemplateHelper, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(ModulesTypesShortName);
    expect(events.on).toHaveBeenCalledTimes(1);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.parseBegin, expect.any(Function));
  });

  it('should monkey-patch the register link from the templates helper', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onParseBegin = null;
    let patchStatusBeforeListener = null;
    let patchStatusAfterListener = null;
    // When
    sut = new ModulesTypesShortName(events, jsdocTemplateHelper, EVENT_NAMES);
    patchStatusBeforeListener = jsdocTemplateHelper.registerLink.monkey === true;
    [[, onParseBegin]] = events.on.mock.calls;
    onParseBegin();
    patchStatusAfterListener = jsdocTemplateHelper.registerLink.monkey === true;
    // Then
    expect(sut).toBeInstanceOf(ModulesTypesShortName);
    expect(patchStatusBeforeListener).toBe(false);
    expect(patchStatusAfterListener).toBe(true);
  });

  it('should ignore links that are not for externals nor for modules', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    const longname = 'SomeFileType';
    const fileUrl = 'some-file-url';
    let sut = null;
    let onParseBegin = null;
    // When
    sut = new ModulesTypesShortName(events, jsdocTemplateHelper, EVENT_NAMES);
    [[, onParseBegin]] = events.on.mock.calls;
    onParseBegin();
    jsdocTemplateHelper.registerLink(longname, fileUrl);
    // Then
    expect(sut).toBeInstanceOf(ModulesTypesShortName);
    expect(registerLinkMock).toHaveBeenCalledTimes(1);
  });

  it('should register a short version for a module type', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    const typeName = 'MyType';
    const longname = `module:node.${typeName}`;
    const fileUrl = 'some-file-url';
    let sut = null;
    let onParseBegin = null;
    // When
    sut = new ModulesTypesShortName(events, jsdocTemplateHelper, EVENT_NAMES);
    [[, onParseBegin]] = events.on.mock.calls;
    onParseBegin();
    jsdocTemplateHelper.registerLink(longname, fileUrl);
    // Then
    expect(sut).toBeInstanceOf(ModulesTypesShortName);
    expect(registerLinkMock).toHaveBeenCalledTimes(2);
    expect(registerLinkMock).toHaveBeenCalledWith(longname, fileUrl);
    expect(registerLinkMock).toHaveBeenCalledWith(typeName, fileUrl);
  });

  it('should register a short version for an external type', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    const typeName = 'MyExternalType';
    const longname = `external:${typeName}`;
    const fileUrl = 'some-file-url';
    let sut = null;
    let onParseBegin = null;
    // When
    sut = new ModulesTypesShortName(events, jsdocTemplateHelper, EVENT_NAMES);
    [[, onParseBegin]] = events.on.mock.calls;
    onParseBegin();
    jsdocTemplateHelper.registerLink(longname, fileUrl);
    // Then
    expect(sut).toBeInstanceOf(ModulesTypesShortName);
    expect(registerLinkMock).toHaveBeenCalledTimes(2);
    expect(registerLinkMock).toHaveBeenCalledWith(longname, fileUrl);
    expect(registerLinkMock).toHaveBeenCalledWith(typeName, fileUrl);
  });
});
