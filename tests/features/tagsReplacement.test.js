jest.unmock('../../src/features/tagsReplacement');
const { TagsReplacement } = require('../../src/features/tagsReplacement');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:tagsReplacement', () => {
  it('should register the listener when instantiated', () => {
    // Given
    const dictionary = {};
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new TagsReplacement(dictionary, events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(TagsReplacement);
    expect(events.on).toHaveBeenCalledTimes(1);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.commentsReady, expect.any(Function));
  });

  it('should replace a dictionary of tags on a file', () => {
    // Given
    const fixture = [
      {
        original: 'parent',
        replacement: 'memberof',
        comment: 'module:node/shared',
      },
      {
        original: 'extends',
        replacement: 'augments',
        comment: 'SomeType',
      },
    ];
    const [comment, expected] = ['original', 'replacement'].map((type) => [
      '/**',
      ...fixture.map((item) => ` * @${item[type]} ${item.comment}`),
      ' */',
    ].join('\n'));
    const extraContent = [
      'Some text with @parent in the middle',
      'or a single line /* @extends Woo */',
      '/**',
      ' * @type {string}',
      ' */',
      'const toTestAnotherBlock = \'\';',
    ].join('\n');
    const dictionary = fixture.reduce(
      (acc, item) => ({ ...acc, [item.original]: item.replacement }),
      {},
    );
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onCommentsReady = null;
    let result = null;
    // When
    sut = new TagsReplacement(dictionary, events, EVENT_NAMES);
    [[, onCommentsReady]] = events.on.mock.calls;
    result = onCommentsReady(`${comment}\n${extraContent}`);
    // Then
    expect(sut).toBeInstanceOf(TagsReplacement);
    expect(result).toBe(`${expected}\n${extraContent}`);
  });
});
