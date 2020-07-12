jest.unmock('../../src/features/typedefImports');
const { TypedefImports } = require('../../src/features/typedefImports');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:typedefImports', () => {
  it('should register the listeners when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new TypedefImports(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(TypedefImports);
    expect(events.on).toHaveBeenCalledTimes(2);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.newComment, expect.any(Function));
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.commentsReady, expect.any(Function));
  });

  it('should ignore a comment that doesn\'t have a typedef import', () => {
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
    sut = new TypedefImports(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(TypedefImports); // to avoid `no-new`.
    expect(result).toBe(source);
  });

  it('should remove a block with a typedef import', () => {
    // Given
    const commentLines = [
      '/**',
      ' * @typedef {import("family").Daughter} Daughter',
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' */',
    ];
    const comment = commentLines.join('\n');
    const content = ' Some other code';
    const source = `${comment}${content}`;
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    const emptyBlock = commentLines.map(() => '').join('\n');
    let result = null;
    // When
    sut = new TypedefImports(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(TypedefImports); // to avoid `no-new`.
    expect(result).toBe(`${emptyBlock}${content}`);
  });

  it('shouldn\'t remove the block if theres an @external tag', () => {
    // Given
    const commentLinesStart = ['/**'];
    const commentLinesImport = [' * @typedef {import("family").Daughter} Daughter'];
    const commentLinesEnd = [
      ' * @external Daughter',
      ' * @see https://www.instagram.com/p/CAiy3zYg7Vx/',
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' */',
    ];
    const comment = [
      ...commentLinesStart,
      ...commentLinesImport,
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
      ...commentLinesImport.map(() => ' * '),
      ...commentLinesEnd,
    ]
    .join('\n');
    let result = null;
    // When
    sut = new TypedefImports(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(TypedefImports); // to avoid `no-new`.
    expect(result).toBe(`${newComment}${content}`);
  });
});
