import { condorcetWinner } from '../condorcet';

describe('condorcetWinner', () => {
  describe('basic functionality', () => {
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

  describe('Condorcet vs Borda distinction', () => {
    it('should return Condorcet winner, not Borda winner, when they differ', () => {
      /**
       * Test case where Borda count and Condorcet method differ
       *
       * Votes:
       * - 8 voters: A > B > C > D
       * - 4 voters: B > C > D > A
       * - 2 voters: C > D > A > B
       * - 1 voter:  D > A > B > C
       *
       * Borda count (4 pts for 1st, 3 for 2nd, 2 for 3rd, 1 for 4th):
       * A: 8*4 + 4*1 + 2*2 + 1*3 = 43 pts
       * B: 8*3 + 4*4 + 2*1 + 1*2 = 44 pts ← Winner with Borda
       * C: 8*2 + 4*3 + 2*4 + 1*1 = 37 pts
       * D: 8*1 + 4*2 + 2*3 + 1*4 = 26 pts
       *
       * Condorcet pairwise comparisons:
       * A vs B: 8+2+1=11 prefer A, 4 prefer B → A beats B
       * A vs C: 8+1=9 prefer A, 4+2=6 prefer C → A beats C
       * A vs D: 8+4=12 prefer A, 2+1=3 prefer D → A beats D
       * → A beats all others, so A is the Condorcet winner
       */
      const candidates = ['A', 'B', 'C', 'D'];
      const ballots = [
        // 8 voters: A > B > C > D
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        ['A', 'B', 'C', 'D'],
        // 4 voters: B > C > D > A
        ['B', 'C', 'D', 'A'],
        ['B', 'C', 'D', 'A'],
        ['B', 'C', 'D', 'A'],
        ['B', 'C', 'D', 'A'],
        // 2 voters: C > D > A > B
        ['C', 'D', 'A', 'B'],
        ['C', 'D', 'A', 'B'],
        // 1 voter: D > A > B > C
        ['D', 'A', 'B', 'C'],
      ];

      const winner = condorcetWinner(candidates, ballots);

      expect(winner).toBe('A'); // Condorcet winner
      expect(winner).not.toBe('B'); // Borda winner
    });
  });

  describe('edge cases', () => {
    it('should return the only candidate when there is only one', () => {
      const candidates = ['Alice'];
      const ballots = [['Alice'], ['Alice'], ['Alice']];

      expect(condorcetWinner(candidates, ballots)).toBe('Alice');
    });

    it('should return the majority winner with two candidates', () => {
      const candidates = ['Alice', 'Bob'];
      const ballots = [
        ['Alice', 'Bob'],
        ['Alice', 'Bob'],
        ['Bob', 'Alice'],
      ];

      expect(condorcetWinner(candidates, ballots)).toBe('Alice');
    });

    it('should return null when two candidates have equal votes', () => {
      const candidates = ['Alice', 'Bob'];
      const ballots = [
        ['Alice', 'Bob'],
        ['Bob', 'Alice'],
      ];

      expect(condorcetWinner(candidates, ballots)).toBe(null);
    });
  });

  describe('Condorcet paradox (cycles)', () => {
    it('should return null when there is a 3-way cycle', () => {
      /**
       * Classic rock-paper-scissors paradox:
       * A beats B (2-1)
       * B beats C (2-1)
       * C beats A (2-1)
       */
      const candidates = ['A', 'B', 'C'];
      const ballots = [
        ['A', 'B', 'C'],
        ['B', 'C', 'A'],
        ['C', 'A', 'B'],
      ];

      expect(condorcetWinner(candidates, ballots)).toBe(null);
    });

    it('should return null for complex multi-candidate cycle', () => {
      const candidates = ['A', 'B', 'C', 'D'];
      const ballots = [
        ['A', 'B', 'C', 'D'],
        ['B', 'C', 'D', 'A'],
        ['C', 'D', 'A', 'B'],
        ['D', 'A', 'B', 'C'],
      ];

      expect(condorcetWinner(candidates, ballots)).toBe(null);
    });
  });

  describe('unanimous cases', () => {
    it('should return the unanimous winner when all voters agree', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice', 'Bob', 'Charlie'],
        ['Alice', 'Bob', 'Charlie'],
        ['Alice', 'Bob', 'Charlie'],
        ['Alice', 'Bob', 'Charlie'],
      ];

      expect(condorcetWinner(candidates, ballots)).toBe('Alice');
    });
  });

  describe('input validation', () => {
    it('should throw error when candidates array is empty', () => {
      expect(() => condorcetWinner([], [['Alice']])).toThrow(
        'Candidates array cannot be empty',
      );
    });

    it('should throw error when candidates is null', () => {
      expect(() =>
        condorcetWinner(null as unknown as string[], [['Alice']]),
      ).toThrow('Candidates array cannot be empty');
    });

    it('should throw error when ballots array is empty', () => {
      expect(() => condorcetWinner(['Alice', 'Bob'], [])).toThrow(
        'Ballots array cannot be empty',
      );
    });

    it('should throw error when ballots is null', () => {
      expect(() =>
        condorcetWinner(['Alice', 'Bob'], null as unknown as string[][]),
      ).toThrow('Ballots array cannot be empty');
    });
  });

  describe('immutability', () => {
    it('should not mutate the original candidates array', () => {
      const candidates = ['Charlie', 'Alice', 'Bob'];
      const originalCandidates = [...candidates];
      const ballots = [
        ['Alice', 'Bob', 'Charlie'],
        ['Bob', 'Alice', 'Charlie'],
        ['Alice', 'Charlie', 'Bob'],
      ];

      condorcetWinner(candidates, ballots);

      expect(candidates).toEqual(originalCandidates);
    });

    it('should not mutate the original ballots array', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice', 'Bob', 'Charlie'],
        ['Bob', 'Alice', 'Charlie'],
        ['Alice', 'Charlie', 'Bob'],
      ];
      const originalBallots = ballots.map((ballot) => [...ballot]);

      condorcetWinner(candidates, ballots);

      expect(ballots).toEqual(originalBallots);
    });
  });

  describe('incomplete ballots', () => {
    it('should handle ballots that do not include all candidates', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice', 'Bob'], // Charlie not ranked
        ['Bob', 'Charlie'], // Alice not ranked
        ['Alice', 'Charlie'], // Bob not ranked
      ];

      // Alice beats Bob 1-0 (only 1 ballot has both)
      // Alice beats Charlie 1-1 (tie)
      // Bob beats Charlie 1-1 (tie)
      // No clear Condorcet winner due to incomplete rankings
      const result = condorcetWinner(candidates, ballots);
      expect([null, 'Alice']).toContain(result);
    });
  });
});
