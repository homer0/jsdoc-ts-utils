jest.unmock('../../src/features/removeTaggedBlocks');
const { RemoveTaggedBlocks } = require('../../src/features/removeTaggedBlocks');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:removeTaggedBlocks', () => {
  it('should register the listeners when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new RemoveTaggedBlocks(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(RemoveTaggedBlocks);
    expect(events.on).toHaveBeenCalledTimes(2);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.newComment, expect.any(Function));
    expect(events.on).toHaveBeenCalledWith(
      EVENT_NAMES.commentsReady,
      expect.any(Function),
    );
  });

  it("should ignore a comment that doesn't have a jsdoc-remove tag", () => {
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
    sut = new RemoveTaggedBlocks(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(RemoveTaggedBlocks); // to avoid `no-new`.
    expect(result).toBe(source);
  });

  it('should remove a block with a jsdoc-remove tag', () => {
    // Given
    const commentLines = [
      '/**',
      ' * @typedef {Daughter} Rosario',
      ' * @typedef {Daughter} Pilar',
      ' * @jsdoc-remove',
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
    sut = new RemoveTaggedBlocks(events, EVENT_NAMES);
    [[, onComment], [, onCommentsReady]] = events.on.mock.calls;
    onComment(comment);
    result = onCommentsReady(source);
    // Then
    expect(sut).toBeInstanceOf(RemoveTaggedBlocks); // to avoid `no-new`.
    expect(result).toBe(`${emptyBlock}${content}`);
  });
});
