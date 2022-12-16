export function condorcetWinner(
  candidates: string[],
  ballots: string[][],
): string | null {
  const votes: Record<string, number> = candidates.reduce(
    (votes, candidate) => {
      votes[candidate] = 0;
      return votes;
    },
    {} as Record<string, number>,
  );

  ballots.forEach((ballot) => {
    ballot.forEach((candidate, index) => {
      votes[candidate] += ballot.length - index;
    });
  });

  const sortedCandidates = candidates.sort((a, b) => votes[b] - votes[a]);

  for (let i = 0; i < sortedCandidates.length; i++) {
    const candidate = sortedCandidates[i];
    let hasBeenBeaten = false;
    for (let j = 0; j < sortedCandidates.length; j++) {
      if (i === j) continue;
      if (votes[candidate] <= votes[sortedCandidates[j]]) {
        hasBeenBeaten = true;
        break;
      }
    }
    if (!hasBeenBeaten) {
      return candidate;
    }
  }

  return null;
}
