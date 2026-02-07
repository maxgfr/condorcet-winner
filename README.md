# condorcet-winner

A TypeScript library implementing two major ranked voting methods: **Condorcet method** and **Borda count**. Compare results, understand voting paradoxes, and choose the right method for your use case.

## Installation

```bash
yarn add condorcet-winner
```

or

```bash
npm install condorcet-winner
```

## Quick Start

```typescript
import { condorcetWinner, bordaWinner } from 'condorcet-winner';

const candidates = ['Alice', 'Bob', 'Charlie'];
const ballots = [
  ['Alice', 'Bob', 'Charlie'],
  ['Bob', 'Charlie', 'Alice'],
  ['Alice', 'Charlie', 'Bob'],
];

// Condorcet method: head-to-head comparisons
const condorcet = condorcetWinner(candidates, ballots);
console.log('Condorcet winner:', condorcet); // 'Alice'

// Borda count: ranking-based points
const borda = bordaWinner(candidates, ballots);
console.log('Borda winner:', borda); // 'Alice'
```

## API Reference

### `condorcetWinner(candidates, ballots)`

Determines the winner using the **Condorcet method** (pairwise comparisons).

**How it works:**
- Compares every pair of candidates head-to-head
- A candidate wins if they beat all others in majority vote
- Returns `null` if no Condorcet winner exists (Condorcet paradox)

**Parameters:**
- `candidates: string[]` - Array of candidate identifiers
- `ballots: string[][]` - Array of ranked ballots (ordered by preference)

**Returns:** `string | null` - The Condorcet winner, or `null` if paradox

**Example:**
```typescript
const winner = condorcetWinner(
  ['A', 'B', 'C'],
  [
    ['A', 'B', 'C'],
    ['B', 'C', 'A'],
    ['C', 'A', 'B']
  ]
);
// Returns null (rock-paper-scissors paradox)
```

---

### `bordaWinner(candidates, ballots)`

Determines the winner using the **Borda count** method (ranking points).

**How it works:**
- Assigns points based on ranking position (1st place = n points, 2nd = n-1, etc.)
- Sums all points across ballots
- Candidate with highest total wins
- Returns `null` only in case of exact tie

**Parameters:**
- `candidates: string[]` - Array of candidate identifiers
- `ballots: string[][]` - Array of ranked ballots (ordered by preference)

**Returns:** `string | null` - The Borda winner, or `null` if exact tie

**Example:**
```typescript
const winner = bordaWinner(
  ['A', 'B', 'C'],
  [
    ['A', 'B', 'C'], // A:3pts, B:2pts, C:1pt
    ['B', 'C', 'A'], // B:3pts, C:2pts, A:1pt
    ['A', 'C', 'B']  // A:3pts, C:2pts, B:1pt
  ]
);
// Returns 'A' (7 points total)
```

## When to Use Each Method

### Use **Condorcet** when:
- ✅ You want the "majority preferred" winner
- ✅ Head-to-head matchup matters most
- ✅ You can handle potential paradoxes (no winner)
- ✅ You need to detect voting cycles

**Example use cases:** Political elections, executive decisions, board voting

### Use **Borda** when:
- ✅ You want a consensus candidate
- ✅ You need a guaranteed winner (no paradoxes)
- ✅ Overall ranking preferences matter
- ✅ You want to consider "intensity" of preferences

**Example use cases:** Award voting, rankings, preference aggregation

## Key Differences

| Feature | Condorcet | Borda |
|---------|-----------|-------|
| **Winner selection** | Beats all others head-to-head | Highest total points |
| **Always has winner?** | ❌ No (paradox possible) | ✅ Yes (unless exact tie) |
| **Considers full ranking** | ❌ Only pairwise | ✅ Yes (all positions) |
| **Majority criterion** | ✅ Yes | ❌ No |
| **Consensus-oriented** | ❌ No | ✅ Yes |

## When Condorcet ≠ Borda

The methods can produce **different winners**. Here's a real example:

```typescript
const candidates = ['A', 'B', 'C', 'D'];
const ballots = [
  // 8 voters
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  ['A', 'B', 'C', 'D'],
  // 4 voters
  ['B', 'C', 'D', 'A'],
  ['B', 'C', 'D', 'A'],
  ['B', 'C', 'D', 'A'],
  ['B', 'C', 'D', 'A'],
  // 2 voters
  ['C', 'D', 'A', 'B'],
  ['C', 'D', 'A', 'B'],
  // 1 voter
  ['D', 'A', 'B', 'C'],
];

condorcetWinner(candidates, ballots); // Returns 'A'
bordaWinner(candidates, ballots);     // Returns 'B'
```

**Why the difference?**
- **A** beats every other candidate head-to-head (Condorcet winner)
- **B** has the highest total points across all rankings (Borda winner)

This demonstrates that Borda rewards candidates who are ranked consistently high, while Condorcet rewards candidates who win direct matchups.

## Input Validation

Both methods validate inputs and throw descriptive errors:

```typescript
// Empty candidates
condorcetWinner([], ballots); // Error: "Candidates array cannot be empty"

// Empty ballots
bordaWinner(candidates, []); // Error: "Ballots array cannot be empty"
```

## Incomplete Ballots

Both methods handle incomplete ballots (voters who don't rank all candidates):

```typescript
const candidates = ['A', 'B', 'C'];
const ballots = [
  ['A', 'B'],    // C not ranked
  ['B'],         // Only ranks B
  ['A', 'C']     // B not ranked
];

// Both methods handle this gracefully
condorcetWinner(candidates, ballots); // Works
bordaWinner(candidates, ballots);     // Works
```

## TypeScript Support

Full TypeScript support with type definitions included:

```typescript
function condorcetWinner(
  candidates: string[],
  ballots: string[][]
): string | null;

function bordaWinner(
  candidates: string[],
  ballots: string[][]
): string | null;
```

## Algorithm Complexity

- **Condorcet:** O(n² × m) where n = candidates, m = ballots
- **Borda:** O(n × m) where n = candidates, m = ballots

Both are efficient for typical election sizes (< 100 candidates, < 10,000 ballots).

## Contributing

Contributions welcome! Please ensure:
- ✅ Tests pass (`yarn test`)
- ✅ Coverage stays at 100% (`yarn test --coverage`)
- ✅ Code is properly formatted (`yarn lint`)
- ✅ Build succeeds (`yarn build`)

## License

MIT

## References

- [Condorcet method (Wikipedia)](https://en.wikipedia.org/wiki/Condorcet_method)
- [Borda count (Wikipedia)](https://en.wikipedia.org/wiki/Borda_count)
- [Condorcet paradox (Wikipedia)](https://en.wikipedia.org/wiki/Condorcet_paradox)
- [Voting systems comparison](https://en.wikipedia.org/wiki/Comparison_of_electoral_systems)
