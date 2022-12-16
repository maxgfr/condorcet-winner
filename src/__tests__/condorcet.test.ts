import { condorcetWinner } from '../condorcet';

describe('condorcetWinner', () => {
  it.each([
    [
      ['Alice', 'Bob', 'Eve'],
      [
        ['Alice', 'Bob', 'Eve'],
        ['Bob', 'Alice', 'Eve'],
        ['Eve', 'Alice', 'Bob'],
      ],
      'Alice',
    ],
    [
      ['Alice', 'Bob', 'Eve'],
      [
        ['Alice', 'Bob', 'Eve'],
        ['Bob', 'Eve', 'Alice'],
        ['Eve', 'Alice', 'Bob'],
      ],
      null,
    ],
    [
      ['Alice', 'Bob', 'Eve'],
      [
        ['Alice', 'Bob', 'Eve'],
        ['Bob', 'Eve', 'Alice'],
        ['Eve', 'Bob', 'Alice'],
      ],
      'Bob',
    ],
  ])(
    'returns %s when given candidates %s and votes %s',
    (candidates, votes, expected) => {
      expect(condorcetWinner(candidates, votes)).toBe(expected);
    },
  );
});
