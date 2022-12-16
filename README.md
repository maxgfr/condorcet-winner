# condorcet-winner

This library is a TypeScript implementation of the [Condorcet method](https://en.wikipedia.org/wiki/Condorcet_method) for determining the winner of a [Condorcet paradox](https://en.wikipedia.org/wiki/Condorcet_paradox) election.

## Installation

```bash
yarn add condorcet-winner
```

## Usage

```typescript
import { condorcetWinner } from 'condorcet-winner';

const winner = condorcetWinner(
  ['A', 'B', 'C'],
  [
    ['A', 'B', 'C'],
    ['B', 'A', 'C'],
    ['C', 'A', 'B'],
  ],
);

console.log(winner); // 'A'
```
