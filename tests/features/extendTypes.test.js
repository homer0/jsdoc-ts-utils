jest.unmock('../../src/features/extendTypes');
const { ExtendTypes } = require('../../src/features/extendTypes');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:extendTypes', () => {
  it('should register the listeners when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new ExtendTypes(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(ExtendTypes);
    expect(events.on).toHaveBeenCalledTimes(2);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.newComment, expect.any(Function));
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.commentsReady, expect.any(Function));
  });

  it('should ignore comments that don\'t extend types nor use intersection', () => {
    // Given
    const comment = [
      '/**',
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' */',
    ].join('\n');
    const source = `${comment} Something`;
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    let result = null;
    // When
    sut = new ExtendTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(ExtendTypes); // to avoid `no-new`.
    expect(result).toBe(source);
  });

  it('should transform an itersection into a union', () => {
    // Given
    const firstType = 'Object';
    const secondType = 'SomeOtherType';
    const definitionName = 'Child';
    const comment = [
      '/**',
      ` * @typedef {${firstType} & ${secondType}} ${definitionName}`,
      ' */',
    ].join('\n');
    const content = ' Some other code';
    const source = `${comment}${content}`;
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    let result = null;
    const newComment = [
      '/**',
      ` * @typedef {${firstType}|${secondType}} ${definitionName}`,
      ' */',
    ].join('\n');
    // When
    sut = new ExtendTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(ExtendTypes); // to avoid `no-new`.
    expect(result).toBe(`${newComment}${content}`);
  });

  it('should transform an intersection into an extension', () => {
    // Given
    const sharedLines = [
      ' * @memberof module:people',
    ];
    const extendedProperiesLines = [
      ' * @property {number} name',
      ' * @property {number} age',
      ' * @property {number} height',
    ];
    const extendedType = 'Human';
    const baseType = 'Entity';
    const comment = [
      '/**',
      ` * @typedef {${baseType} & ${extendedType}Properties} ${extendedType}`,
      ...sharedLines,
      ' */',
    ].join('\n');
    const propertiesLines = [
      '/**',
      ` * @typedef {Object} ${extendedType}Properties`,
      ...extendedProperiesLines,
      ...sharedLines,
      ` * @augments ${extendedType}`,
      ' */',
    ];
    const propertiesComment = propertiesLines.join('\n');
    const content = 'Some other code';
    const source = [
      comment,
      propertiesComment,
      content,
    ].join('\n');
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    let result = null;
    const newComment = [
      '/**',
      ` * @typedef {${baseType}} ${extendedType}`,
      ...sharedLines,
      ...extendedProperiesLines,
      ' */',
    ].join('\n');
    const emptyBlock = new Array(propertiesLines.length - extendedProperiesLines.length)
    .fill('')
    .join('\n');
    const expectedResult = [
      newComment,
      emptyBlock,
      content,
    ].join('\n');
    // When
    sut = new ExtendTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    onComment(propertiesComment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(ExtendTypes); // to avoid `no-new`.
    expect(result).toBe(expectedResult);
  });

  it('should transform an intersection (multiline) into an extension', () => {
    // Given
    const sharedLines = [
      ' * @memberof module:people',
    ];
    const extendedProperiesLines = [
      ' * @property {number} name',
      ' * @property {number} age',
      ' * @property {number} height',
    ];
    const extendedType = 'Human';
    const baseType = 'Entity';
    const comment = [
      '/**',
      ` * @typedef {${baseType} & ${extendedType}Properties}`,
      ` * ${extendedType}`,
      ...sharedLines,
      ' */',
    ].join('\n');
    const propertiesLines = [
      '/**',
      ` * @typedef {Object} ${extendedType}Properties`,
      ...extendedProperiesLines,
      ...sharedLines,
      ` * @augments ${extendedType}`,
      ' */',
    ];
    const propertiesComment = propertiesLines.join('\n');
    const content = 'Some other code';
    const source = [
      comment,
      propertiesComment,
      content,
    ].join('\n');
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    let result = null;
    const newComment = [
      '/**',
      ` * @typedef {${baseType}}`,
      ` * ${extendedType}`,
      ...sharedLines,
      ...extendedProperiesLines,
      ' */',
    ].join('\n');
    const emptyBlock = new Array(propertiesLines.length - extendedProperiesLines.length)
    .fill('')
    .join('\n');
    const expectedResult = [
      newComment,
      emptyBlock,
      content,
    ].join('\n');
    // When
    sut = new ExtendTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    onComment(propertiesComment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(ExtendTypes); // to avoid `no-new`.
    expect(result).toBe(expectedResult);
  });
});
