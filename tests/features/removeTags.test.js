jest.unmock('../../src/features/removeTags');
const { RemoveTags } = require('../../src/features/removeTags');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:removeTags', () => {
  it('should register the listeners when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new RemoveTags(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(RemoveTags);
    expect(events.on).toHaveBeenCalledTimes(2);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.newComment, expect.any(Function));
    expect(events.on).toHaveBeenCalledWith(
      EVENT_NAMES.commentsReady,
      expect.any(Function),
    );
  });

  it("should ignore a comment that doesn't have a jsdoc-remove-next-tag tag", () => {
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
    sut = new RemoveTags(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(RemoveTags); // to avoid `no-new`.
    expect(result).toBe(source);
  });

  it('should remove a tag', () => {
    // Given
    const commentLinesStart = ['/**'];
    const commentLinesToRemove = [
      ' * @jsdoc-remove-next-tag',
      ' * @typedef {Something} else',
    ];
    const commentLinesEnd = [
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' */',
    ];
    const comment = [
      ...commentLinesStart,
      ...commentLinesToRemove,
      ...commentLinesEnd,
    ].join('\n');
    const content = ' Some other code';
    const source = `${comment}${content}`;
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onComment = null;
    let onCommentsReady = null;
    const newComment = [...commentLinesStart, ...commentLinesEnd].join('\n');
    let result = null;
    // When
    sut = new RemoveTags(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(RemoveTags); // to avoid `no-new`.
    expect(result).toBe(`${newComment}${content}`);
  });

  it('should remove multiple tags', () => {
    // Given
    const comment = [
      '/**',
      ' * @jsdoc-remove-next-tag',
      " * @typedef {JQuery.AjaxSettings['success']} JQueryOnSuccess",
      ' * @external JQueryOnSuccess',
      ' * @see {@link http://api.jquery.com/jQuery.ajax/#success}',
      ' * @jsdoc-remove-next-tag',
      " * @typedef {JQuery.AjaxSettings['error']} JQueryOnError",
      ' * @external JQueryOnError',
      ' * @see {@link http://api.jquery.com/jQuery.ajax/#error}',
      ' * @jsdoc-remove-next-tag',
      ' * @typedef {{(param1: string, param2: number) => string}} SomeFn',
      ' */',
    ].join('\n');
    const newComment = [
      '/**',
      ' * @external JQueryOnSuccess',
      ' * @see {@link http://api.jquery.com/jQuery.ajax/#success}',
      ' * @external JQueryOnError',
      ' * @see {@link http://api.jquery.com/jQuery.ajax/#error}',
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
    // When
    sut = new RemoveTags(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(RemoveTags); // to avoid `no-new`.
    expect(result).toBe(`${newComment}${content}`);
  });
});
