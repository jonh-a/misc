/*
  Generate N number of spelling puzzles as JSON output.

  Example:
  # Create 5 puzzles and save to puzzles.json
  bun run src/scripts/generateSpellingPuzzles.ts 5 > puzzles.json
*/

import { type Puzzle } from "../definitions";

export const generateNDifferentPuzzles = async (n: number): Promise<Puzzle[]> => {
  const words = await readWordlist();
  return generateSpellingPuzzle(words, [], n);
};

const readWordlist = async () => {
  const f = Bun.file('files/dice.txt');
  const words = (await f.text()).split('\n');
  return words;
};

const generateSpellingPuzzle = (
  words: string[],
  puzzles: Puzzle[] = [],
  remainder: number,
): Puzzle[] => {
  if (remainder === 0) return puzzles;

  console.debug(` > Generating puzzle #${remainder}...`);
  const puzzle = attemptValidLetterCombination(words);

  if (puzzles.includes(puzzle)) {
    console.debug(` > Found duplicate - regenerating...`);
    return generateSpellingPuzzle(words, [...puzzles], remainder);
  }

  return generateSpellingPuzzle(words, [...puzzles, puzzle], remainder - 1);
};

const attemptValidLetterCombination = (
  words: string[],
  attempt: number = 0
): Puzzle => {
  if (attempt > 10000) {
    throw new Error('Failed to generate a valid puzzle after 10,000 attempts.');
  }

  const letters = getRandomLetters();
  const [requiredLetter, ...otherLetters] = letters;
  const validWords = words.filter((word: string) => {
    const wordSet = new Set(Array.from(word));
    const possibleLettersSet = new Set(letters);
    return (
      wordSet.has(requiredLetter)
      && possibleLettersSet.isSupersetOf(wordSet)
      && word.length > 3
    );
  });

  const panagrams = getPanagrams(letters, validWords);

  if (panagrams.length >= 1 && validWords.length > 10) {
    return { requiredLetter, otherLetters, panagrams, validWords };
  }
  return attemptValidLetterCombination(words, attempt + 1);
};

const getPanagrams = (letters: string[], words: string[]): string[] => {
  const letterSet = new Set(letters);

  const panagrams = words.filter((word: string) => {
    const wordSet = new Set(Array.from(word));
    return (letterSet.isSupersetOf(wordSet) && letterSet.isSubsetOf(wordSet));
  });

  return panagrams;
};

const getRandomLetters = (): string[] => {
  return 'abcdefghijklmnopqrstuvwxyz'
    .split('')
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
    .slice(0, 7);
};

if (import.meta.main) {
  (async () => {
    const numberOfPuzzles = Number(Bun.argv[2]);
    if (!numberOfPuzzles || Number.isNaN(numberOfPuzzles)) {
      console.error("Argument must be a number.");
      process.exit(1);
    }

    const puzzles = await generateNDifferentPuzzles(numberOfPuzzles);
    console.log(JSON.stringify(puzzles, null, 2));
  })();
}