jest.unmock('../src/plugin');
jest.mock('events');
jest.mock('jsdoc/lib/jsdoc/env', () => ({
  conf: {},
}));
jest.mock('jsdoc/lib/jsdoc/util/templateHelper', () => ({}));

const jsdocTemplateHelper = require('jsdoc/lib/jsdoc/util/templateHelper');
const { EVENT_NAMES } = require('../src/constants');

describe('plugin', () => {
  const loadPlugin = (options = null, eventsMock = null) => {
    if (options) {
      // eslint-disable-next-line global-require
      const jsdocEnv = require('jsdoc/lib/jsdoc/env');
      jsdocEnv.conf.tsUtils = options;
    }
    // eslint-disable-next-line global-require
    const { EventEmitter } = require('events');
    const events = eventsMock || {
      emit: jest.fn(),
      listeners: jest.fn(),
    };
    EventEmitter.mockImplementationOnce(() => events);
    // eslint-disable-next-line global-require
    const plugin = require('../src/plugin');
    // eslint-disable-next-line global-require
    const features = require('../src/features');
    return {
      plugin,
      features,
      events,
    };
  };

  beforeEach(() => {
    jest.resetModules();
  });

  it('should be loaded with the default options', () => {
    // Given
    let sut = null;
    let features = null;
    let events = null;
    // When
    ({ plugin: sut, features, events } = loadPlugin());
    // Then
    expect(sut.handlers).toEqual({
      parseBegin: expect.any(Function),
      beforeParse: expect.any(Function),
    });
    expect(sut.options).toEqual({
      typedefImports: true,
      extendTypes: true,
      modulesOnMemberOf: true,
      modulesTypesShortName: true,
      typeScriptUtilityTypes: true,
      tagsReplacement: null,
    });
    expect(features.TypedefImports).toHaveBeenCalledTimes(1);
    expect(features.TypedefImports).toHaveBeenCalledWith(
      events,
      EVENT_NAMES,
    );
    expect(features.ExtendTypes).toHaveBeenCalledTimes(1);
    expect(features.ExtendTypes).toHaveBeenCalledWith(
      events,
      EVENT_NAMES,
    );
    expect(features.ModulesOnMemberOf).toHaveBeenCalledTimes(1);
    expect(features.ModulesOnMemberOf).toHaveBeenCalledWith(
      events,
      EVENT_NAMES,
    );
    expect(features.ModulesTypesShortName).toHaveBeenCalledTimes(1);
    expect(features.ModulesTypesShortName).toHaveBeenCalledWith(
      events,
      jsdocTemplateHelper,
      EVENT_NAMES,
    );
    expect(features.TSUtilitiesTypes).toHaveBeenCalledTimes(1);
    expect(features.TSUtilitiesTypes).toHaveBeenCalledWith(
      events,
      EVENT_NAMES,
    );
    expect(features.TagsReplacement).toHaveBeenCalledTimes(0);
  });

  it('should be loaded without the typedef imports feature', () => {
    // Given
    let sut = null;
    let features = null;
    // When
    ({ plugin: sut, features } = loadPlugin({
      typedefImports: false,
    }));
    // Then
    expect(sut.options).toEqual({
      typedefImports: false,
      extendTypes: true,
      modulesOnMemberOf: true,
      modulesTypesShortName: true,
      typeScriptUtilityTypes: true,
      tagsReplacement: null,
    });
    expect(features.TypedefImports).toHaveBeenCalledTimes(0);
  });

  it('should be loaded without the extend types feature', () => {
    // Given
    let sut = null;
    let features = null;
    // When
    ({ plugin: sut, features } = loadPlugin({
      extendTypes: false,
    }));
    // Then
    expect(sut.options).toEqual({
      typedefImports: true,
      extendTypes: false,
      modulesOnMemberOf: true,
      modulesTypesShortName: true,
      typeScriptUtilityTypes: true,
      tagsReplacement: null,
    });
    expect(features.ExtendTypes).toHaveBeenCalledTimes(0);
  });

  it('should be loaded without the modules on memberof feature', () => {
    // Given
    let sut = null;
    let features = null;
    // When
    ({ plugin: sut, features } = loadPlugin({
      modulesOnMemberOf: false,
    }));
    // Then
    expect(sut.options).toEqual({
      typedefImports: true,
      extendTypes: true,
      modulesOnMemberOf: false,
      modulesTypesShortName: true,
      typeScriptUtilityTypes: true,
      tagsReplacement: null,
    });
    expect(features.ModulesOnMemberOf).toHaveBeenCalledTimes(0);
  });

  it('should be loaded without the modules types short name feature', () => {
    // Given
    let sut = null;
    let features = null;
    // When
    ({ plugin: sut, features } = loadPlugin({
      modulesTypesShortName: false,
    }));
    // Then
    expect(sut.options).toEqual({
      typedefImports: true,
      extendTypes: true,
      modulesOnMemberOf: true,
      modulesTypesShortName: false,
      typeScriptUtilityTypes: true,
      tagsReplacement: null,
    });
    expect(features.ModulesTypesShortName).toHaveBeenCalledTimes(0);
  });

  it('should be loaded without the TS utility types feature', () => {
    // Given
    let sut = null;
    let features = null;
    // When
    ({ plugin: sut, features } = loadPlugin({
      typeScriptUtilityTypes: false,
    }));
    // Then
    expect(sut.options).toEqual({
      typedefImports: true,
      extendTypes: true,
      modulesOnMemberOf: true,
      modulesTypesShortName: true,
      typeScriptUtilityTypes: false,
      tagsReplacement: null,
    });
    expect(features.TSUtilitiesTypes).toHaveBeenCalledTimes(0);
  });

  it('should be loaded the tags replacement feature configured', () => {
    // Given
    const dictionary = {
      parent: 'memeberof',
    };
    let sut = null;
    let features = null;
    let events = null;
    // When
    ({ plugin: sut, features, events } = loadPlugin({
      tagsReplacement: dictionary,
    }));
    // Then
    expect(sut.handlers).toEqual({
      parseBegin: expect.any(Function),
      beforeParse: expect.any(Function),
    });
    expect(sut.options).toEqual({
      typedefImports: true,
      extendTypes: true,
      modulesOnMemberOf: true,
      modulesTypesShortName: true,
      typeScriptUtilityTypes: true,
      tagsReplacement: dictionary,
    });
    expect(features.TagsReplacement).toHaveBeenCalledTimes(1);
    expect(features.TagsReplacement).toHaveBeenCalledWith(
      dictionary,
      events,
      EVENT_NAMES,
    );
  });

  it('should emit the parseBegin event using the local emitter', () => {
    // Given
    const event = {
      sourcefiles: [],
    };
    let sut = null;
    let events = null;
    // When
    ({ plugin: sut, events } = loadPlugin());
    sut.handlers.parseBegin(event);
    // Then
    expect(events.emit).toHaveBeenCalledTimes(1);
    expect(events.emit).toHaveBeenCalledWith(
      EVENT_NAMES.parseBegin,
      event,
    );
  });

  it('should reduce the contents of a file using the beforeParse event', () => {
    // Given
    const comment = [
      '/**',
      ' * @typedef {import("family").Daughter} Daughter',
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' */',
    ].join('\n');
    const contents = 'const hello = () => \'world\';';
    const source = `${comment}${contents}`;
    const filename = 'daughters.js';
    const firstListenerResult = 1;
    const firstListener = jest.fn(() => firstListenerResult);
    const secondListenerResult = 2;
    const secondListener = jest.fn(() => secondListenerResult);
    const events = {
      emit: jest.fn(),
      listeners: jest.fn(() => [firstListener, secondListener]),
    };
    const event = {
      source,
      filename,
    };
    let sut = null;
    // When
    ({ plugin: sut } = loadPlugin(null, events));
    sut.handlers.beforeParse(event);
    // Then
    expect(event.source).toEqual(secondListenerResult);
    expect(events.emit).toHaveBeenCalledTimes(1);
    expect(events.emit).toHaveBeenCalledWith(
      EVENT_NAMES.newComment,
      comment,
      filename,
    );
    expect(events.listeners).toHaveBeenCalledTimes(1);
    expect(events.listeners).toHaveBeenCalledWith(EVENT_NAMES.commentsReady);
    expect(firstListener).toHaveBeenCalledTimes(1);
    expect(firstListener).toHaveBeenCalledWith(source, filename);
    expect(secondListener).toHaveBeenCalledTimes(1);
    expect(secondListener).toHaveBeenCalledWith(firstListenerResult, filename);
  });
});
