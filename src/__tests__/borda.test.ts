import { bordaWinner } from '../condorcet';

describe('bordaWinner', () => {
  describe('basic functionality', () => {
    it('should return the candidate with the highest Borda score', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice', 'Bob', 'Charlie'], // Alice: 3, Bob: 2, Charlie: 1
        ['Bob', 'Charlie', 'Alice'], // Bob: 3, Charlie: 2, Alice: 1
        ['Alice', 'Charlie', 'Bob'], // Alice: 3, Charlie: 2, Bob: 1
      ];
      // Total: Alice: 7, Bob: 6, Charlie: 5

      expect(bordaWinner(candidates, ballots)).toBe('Alice');
    });

    it('should handle unanimous preference', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice', 'Bob', 'Charlie'],
        ['Alice', 'Bob', 'Charlie'],
        ['Alice', 'Bob', 'Charlie'],
      ];

      expect(bordaWinner(candidates, ballots)).toBe('Alice');
    });

    it('should calculate scores correctly with multiple candidates', () => {
      const candidates = ['A', 'B', 'C', 'D', 'E'];
      const ballots = [
        ['A', 'B', 'C', 'D', 'E'], // A:5, B:4, C:3, D:2, E:1
        ['B', 'A', 'C', 'D', 'E'], // B:5, A:4, C:3, D:2, E:1
        ['A', 'C', 'B', 'D', 'E'], // A:5, C:4, B:3, D:2, E:1
      ];
      // Total: A:14, B:12, C:10, D:6, E:3

      expect(bordaWinner(candidates, ballots)).toBe('A');
    });
  });

  describe('Borda vs Condorcet distinction', () => {
    it('should return Borda winner when it differs from Condorcet winner', () => {
      /**
       * This is the classic test case where Borda and Condorcet disagree
       *
       * Votes:
       * - 8 voters: A > B > C > D
       * - 4 voters: B > C > D > A
       * - 2 voters: C > D > A > B
       * - 1 voter:  D > A > B > C
       *
       * Borda scores (4 pts for 1st, 3 for 2nd, 2 for 3rd, 1 for 4th):
       * A: 8*4 + 4*1 + 2*2 + 1*3 = 32 + 4 + 4 + 3 = 43 pts
       * B: 8*3 + 4*4 + 2*1 + 1*2 = 24 + 16 + 2 + 2 = 44 pts ← Borda winner
       * C: 8*2 + 4*3 + 2*4 + 1*1 = 16 + 12 + 8 + 1 = 37 pts
       * D: 8*1 + 4*2 + 2*3 + 1*4 = 8 + 8 + 6 + 4 = 26 pts
       *
       * But A is the Condorcet winner (beats all others head-to-head)
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

      const winner = bordaWinner(candidates, ballots);

      expect(winner).toBe('B'); // Borda winner
      expect(winner).not.toBe('A'); // Condorcet winner would be A
    });
  });

  describe('edge cases', () => {
    it('should return the only candidate when there is only one', () => {
      const candidates = ['Alice'];
      const ballots = [['Alice'], ['Alice'], ['Alice']];

      expect(bordaWinner(candidates, ballots)).toBe('Alice');
    });

    it('should handle two candidates correctly', () => {
      const candidates = ['Alice', 'Bob'];
      const ballots = [
        ['Alice', 'Bob'], // Alice: 2, Bob: 1
        ['Alice', 'Bob'], // Alice: 2, Bob: 1
        ['Bob', 'Alice'], // Bob: 2, Alice: 1
      ];
      // Total: Alice: 5, Bob: 4

      expect(bordaWinner(candidates, ballots)).toBe('Alice');
    });

    it('should return null when there is a perfect tie', () => {
      const candidates = ['Alice', 'Bob'];
      const ballots = [
        ['Alice', 'Bob'], // Alice: 2, Bob: 1
        ['Bob', 'Alice'], // Bob: 2, Alice: 1
      ];
      // Total: Alice: 3, Bob: 3 (tie)

      expect(bordaWinner(candidates, ballots)).toBe(null);
    });

    it('should return null for three-way tie', () => {
      const candidates = ['A', 'B', 'C'];
      const ballots = [
        ['A', 'B', 'C'],
        ['B', 'C', 'A'],
        ['C', 'A', 'B'],
      ];
      // Each gets: 3 + 2 + 1 = 6 points (perfect symmetry)

      expect(bordaWinner(candidates, ballots)).toBe(null);
    });
  });

  describe('input validation', () => {
    it('should throw error when candidates array is empty', () => {
      expect(() => bordaWinner([], [['Alice']])).toThrow(
        'Candidates array cannot be empty',
      );
    });

    it('should throw error when candidates is null', () => {
      expect(() =>
        bordaWinner(null as unknown as string[], [['Alice']]),
      ).toThrow('Candidates array cannot be empty');
    });

    it('should throw error when ballots array is empty', () => {
      expect(() => bordaWinner(['Alice', 'Bob'], [])).toThrow(
        'Ballots array cannot be empty',
      );
    });

    it('should throw error when ballots is null', () => {
      expect(() =>
        bordaWinner(['Alice', 'Bob'], null as unknown as string[][]),
      ).toThrow('Ballots array cannot be empty');
    });
  });

  describe('incomplete ballots', () => {
    it('should handle ballots with missing candidates', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice', 'Bob'], // Alice: 3, Bob: 2, Charlie: 0
        ['Bob', 'Charlie'], // Bob: 3, Charlie: 2, Alice: 0
        ['Alice', 'Charlie'], // Alice: 3, Charlie: 2, Bob: 0
      ];
      // Total: Alice: 6, Bob: 5, Charlie: 4

      expect(bordaWinner(candidates, ballots)).toBe('Alice');
    });

    it('should handle single-choice ballots', () => {
      const candidates = ['Alice', 'Bob', 'Charlie'];
      const ballots = [
        ['Alice'], // Only Alice gets 3 points
        ['Alice'], // Only Alice gets 3 points
        ['Bob'], // Only Bob gets 3 points
      ];
      // Total: Alice: 6, Bob: 3, Charlie: 0

      expect(bordaWinner(candidates, ballots)).toBe('Alice');
    });
  });

  describe('score calculation verification', () => {
    it('should assign correct points for each position', () => {
      const candidates = ['A', 'B', 'C', 'D'];
      const ballots = [['A', 'B', 'C', 'D']];
      // With 4 candidates: 1st=4pts, 2nd=3pts, 3rd=2pts, 4th=1pt

      // A should win with 4 points
      expect(bordaWinner(candidates, ballots)).toBe('A');
    });

    it('should aggregate scores across multiple ballots correctly', () => {
      const candidates = ['X', 'Y', 'Z'];
      const ballots = [
        ['X', 'Y', 'Z'], // X:3, Y:2, Z:1
        ['Y', 'X', 'Z'], // Y:3, X:2, Z:1
        ['X', 'Y', 'Z'], // X:3, Y:2, Z:1
        ['X', 'Y', 'Z'], // X:3, Y:2, Z:1
      ];
      // Total: X:11, Y:9, Z:4

      expect(bordaWinner(candidates, ballots)).toBe('X');
    });
  });

  describe('comparison with different voting scenarios', () => {
    it('should handle scenario with clear majority preference', () => {
      const candidates = ['Popular', 'Moderate', 'Unpopular'];
      const ballots = [
        ['Popular', 'Moderate', 'Unpopular'],
        ['Popular', 'Moderate', 'Unpopular'],
        ['Popular', 'Moderate', 'Unpopular'],
        ['Moderate', 'Popular', 'Unpopular'],
      ];

      expect(bordaWinner(candidates, ballots)).toBe('Popular');
    });

    it('should favor consensus candidates over polarizing ones', () => {
      const candidates = ['Polarizing', 'Consensus'];
      const ballots = [
        ['Polarizing', 'Consensus'], // Polarizing: 2, Consensus: 1
        ['Polarizing', 'Consensus'], // Polarizing: 2, Consensus: 1
        ['Consensus', 'Polarizing'], // Consensus: 2, Polarizing: 1
        ['Consensus', 'Polarizing'], // Consensus: 2, Polarizing: 1
        ['Consensus', 'Polarizing'], // Consensus: 2, Polarizing: 1
      ];
      // Total: Polarizing: 7, Consensus: 8

      expect(bordaWinner(candidates, ballots)).toBe('Consensus');
    });
  });
});
