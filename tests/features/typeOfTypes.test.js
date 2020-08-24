jest.unmock('../../src/features/typeOfTypes');
const { TypeOfTypes } = require('../../src/features/typeOfTypes');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:typeOfTypes', () => {
  it('should register the listeners when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new TypeOfTypes(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(TypeOfTypes);
    expect(events.on).toHaveBeenCalledTimes(2);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.newComment, expect.any(Function));
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.commentsReady, expect.any(Function));
  });

  it('should ignore a comment that doesn\'t have a typedef with typeof', () => {
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
    sut = new TypeOfTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(TypeOfTypes); // to avoid `no-new`.
    expect(result).toBe(source);
  });

  it('should use Class.<T> for a type with typeof on a typedef', () => {
    // Given
    const type = 'Daughter';
    const commentLinesStart = ['/**'];
    const commentLineTypeOf = ` * @typedef {typeof ${type}} DaughterConstructor`;
    const commentLinesEnd = [
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' */',
    ];
    const comment = [
      ...commentLinesStart,
      commentLineTypeOf,
      ...commentLinesEnd,
    ]
    .join('\n');
    const content = ' Some other code';
    const source = `${comment}${content}`;
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    const newComment = [
      ...commentLinesStart,
      ` * @typedef {Class.<${type}>} DaughterConstructor`,
      ...commentLinesEnd,
    ]
    .join('\n');
    let result = null;
    // When
    sut = new TypeOfTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(TypeOfTypes); // to avoid `no-new`.
    expect(result).toBe(`${newComment}${content}`);
  });

  it('should use Class.<T> for a type with typeof on a function block', () => {
    // Given
    const type = 'Daughter';
    const paramDescription = 'Some description';
    const commentLinesStart = ['/**', 'Some function description', ''];
    const commentLineTypeOf = ` * @param {typeof ${type}} DaughterConstructor ${paramDescription}`;
    const commentLinesEnd = [
      ` * @param {Daughter} Rosario ${paramDescription}`,
      ` * @param {Daughter} Pilar ${paramDescription}`,
      ' * @returns {string}',
      ' */',
    ];
    const comment = [
      ...commentLinesStart,
      commentLineTypeOf,
      ...commentLinesEnd,
    ]
    .join('\n');
    const content = [
      '',
      'function doSometing(DaughterConstructor, Rosario, Pilar) {',
      ' return \'something\';',
      '}',
    ]
    .join('\n');
    const source = `${comment}${content}`;
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    const newComment = [
      ...commentLinesStart,
      ` * @param {Class.<${type}>} DaughterConstructor ${paramDescription}`,
      ...commentLinesEnd,
    ]
    .join('\n');
    let result = null;
    // When
    sut = new TypeOfTypes(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(TypeOfTypes); // to avoid `no-new`.
    expect(result).toBe(`${newComment}${content}`);
  });
});
