/**
 * Determines the Condorcet winner using pairwise comparisons.
 *
 * The Condorcet method finds the candidate who would win a head-to-head
 * election against every other candidate. If no such candidate exists
 * (Condorcet paradox), returns null.
 *
 * @param candidates - Array of candidate identifiers
 * @param ballots - Array of ranked ballots, where each ballot is an array
 *                  of candidates in order of preference
 * @returns The Condorcet winner, or null if no winner exists
 * @throws Error if candidates or ballots are empty
 *
 * @example
 * ```typescript
 * const candidates = ['A', 'B', 'C'];
 * const ballots = [
 *   ['A', 'B', 'C'],
 *   ['B', 'C', 'A'],
 *   ['A', 'C', 'B']
 * ];
 * const winner = condorcetWinner(candidates, ballots); // Returns 'A'
 * ```
 */
export function condorcetWinner(
  candidates: string[],
  ballots: string[][],
): string | null {
  // Validation des entrées
  if (!candidates || candidates.length === 0) {
    throw new Error('Candidates array cannot be empty');
  }
  if (!ballots || ballots.length === 0) {
    throw new Error('Ballots array cannot be empty');
  }

  // Créer une copie immuable pour éviter les mutations
  const candidatesCopy = [...candidates];

  // Construire la matrice de comparaisons par paires
  // pairwiseWins[A] contient l'ensemble des candidats que A bat
  const pairwiseWins: Record<string, Set<string>> = {};
  candidatesCopy.forEach((candidate) => {
    pairwiseWins[candidate] = new Set();
  });

  // Pour chaque paire de candidats
  for (let i = 0; i < candidatesCopy.length; i++) {
    for (let j = i + 1; j < candidatesCopy.length; j++) {
      const candidateA = candidatesCopy[i];
      const candidateB = candidatesCopy[j];

      let votesForA = 0;
      let votesForB = 0;

      // Compter les préférences dans chaque bulletin
      ballots.forEach((ballot) => {
        const indexA = ballot.indexOf(candidateA);
        const indexB = ballot.indexOf(candidateB);

        // Si les deux candidats sont dans ce bulletin
        if (indexA !== -1 && indexB !== -1) {
          if (indexA < indexB) {
            // A est classé avant B (index plus petit = meilleur rang)
            votesForA++;
          } else {
            votesForB++;
          }
        }
      });

      // Enregistrer qui gagne cette comparaison (majorité simple)
      if (votesForA > votesForB) {
        pairwiseWins[candidateA].add(candidateB);
      } else if (votesForB > votesForA) {
        pairwiseWins[candidateB].add(candidateA);
      }
      // En cas d'égalité exacte, aucun des deux ne bat l'autre
    }
  }

  // Trouver le gagnant de Condorcet (bat tous les autres)
  for (const candidate of candidatesCopy) {
    const beatsAll = candidatesCopy.every(
      (other) => candidate === other || pairwiseWins[candidate].has(other),
    );
    if (beatsAll) {
      return candidate;
    }
  }

  // Pas de gagnant de Condorcet (paradoxe de Condorcet)
  return null;
}

/**
 * Determines the winner using the Borda count method.
 *
 * The Borda count assigns points to candidates based on their ranking position
 * in each ballot. The candidate ranked first receives n points (where n is the
 * number of candidates), second receives n-1 points, and so on. The candidate
 * with the most total points wins.
 *
 * Unlike Condorcet, Borda count always produces a winner (no paradox) and
 * considers the intensity of preferences across all rankings, not just pairwise
 * comparisons.
 *
 * @param candidates - Array of candidate identifiers
 * @param ballots - Array of ranked ballots, where each ballot is an array
 *                  of candidates in order of preference
 * @returns The Borda count winner, or null if there is an exact tie
 * @throws Error if candidates or ballots are empty
 *
 * @example
 * ```typescript
 * const candidates = ['A', 'B', 'C'];
 * const ballots = [
 *   ['A', 'B', 'C'],  // A gets 3pts, B gets 2pts, C gets 1pt
 *   ['B', 'C', 'A'],  // B gets 3pts, C gets 2pts, A gets 1pt
 *   ['A', 'C', 'B']   // A gets 3pts, C gets 2pts, B gets 1pt
 * ];
 * const winner = bordaWinner(candidates, ballots); // Returns 'A' (7 points)
 * ```
 */
export function bordaWinner(
  candidates: string[],
  ballots: string[][],
): string | null {
  // Validation des entrées
  if (!candidates || candidates.length === 0) {
    throw new Error('Candidates array cannot be empty');
  }
  if (!ballots || ballots.length === 0) {
    throw new Error('Ballots array cannot be empty');
  }

  const numCandidates = candidates.length;

  // Initialiser les scores Borda pour chaque candidat
  const bordaScores: Record<string, number> = {};
  candidates.forEach((candidate) => {
    bordaScores[candidate] = 0;
  });

  // Calculer les points Borda pour chaque bulletin
  ballots.forEach((ballot) => {
    ballot.forEach((candidate, index) => {
      // Le candidat en position `index` reçoit (numCandidates - index) points
      // Position 0 (premier) = numCandidates points
      // Position 1 (deuxième) = numCandidates - 1 points, etc.
      if (bordaScores[candidate] !== undefined) {
        bordaScores[candidate] += numCandidates - index;
      }
    });
  });

  // Trouver le score maximum
  let maxScore = -1;
  let winnersWithMaxScore: string[] = [];

  candidates.forEach((candidate) => {
    const score = bordaScores[candidate];
    if (score > maxScore) {
      maxScore = score;
      winnersWithMaxScore = [candidate];
    } else if (score === maxScore) {
      winnersWithMaxScore.push(candidate);
    }
  });

  // Retourner null en cas d'égalité parfaite, sinon le gagnant
  if (winnersWithMaxScore.length > 1) {
    return null;
  }

  return winnersWithMaxScore[0];
}
