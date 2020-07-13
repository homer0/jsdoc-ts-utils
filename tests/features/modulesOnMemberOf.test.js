jest.unmock('../../src/features/modulesOnMemberOf');
const { ModulesOnMemberOf } = require('../../src/features/modulesOnMemberOf');
const { EVENT_NAMES } = require('../../src/constants');

describe('features:modulesOnMemberOf', () => {
  it('should register the listener when instantiated', () => {
    // Given
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    // When
    sut = new ModulesOnMemberOf(events, EVENT_NAMES);
    // Then
    expect(sut).toBeInstanceOf(ModulesOnMemberOf);
    expect(events.on).toHaveBeenCalledTimes(1);
    expect(events.on).toHaveBeenCalledWith(EVENT_NAMES.commentsReady, expect.any(Function));
  });

  it('should fix the modules\' paths on memberof tags that use dot notation', () => {
    // Given
    const fixture = [
      {
        comment: '@memberof module.node/shared',
        expected: '@memberof module:node/shared',
      },
      {
        comment: '@memberof module:node/utils',
        expected: '@memberof module:node/utils',
      },
      {
        comment: '@memberof! module.node/shared',
        expected: '@memberof! module:node/shared',
      },
      {
        comment: '@memberof! module:node/utils',
        expected: '@memberof! module:node/utils',
      },
      {
        comment: '@memberof module.exports',
        expected: '@memberof module.exports',
      },
      {
        comment: '@memberof! module.exports',
        expected: '@memberof! module.exports',
      },
    ];
    const [comment, expected] = ['comment', 'expected'].map((type) => [
      '/**',
      ...fixture.map((item) => ` * ${item[type]}`),
      ' */',
    ].join('\n'));
    const events = {
      on: jest.fn(),
    };
    let sut = null;
    let onCommentsReady = null;
    let result = null;
    // When
    sut = new ModulesOnMemberOf(events, EVENT_NAMES);
    [[, onCommentsReady]] = events.on.mock.calls;
    result = onCommentsReady(comment);
    // Then
    expect(sut).toBeInstanceOf(ModulesOnMemberOf);
    expect(result).toBe(expected);
  });
});
