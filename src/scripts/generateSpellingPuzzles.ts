/*
  Generate N number of spelling puzzles.

  Example:
  # To create 5 puzzles
  bun run scripts/generateSpellingPuzzles.ts 5
*/

interface Puzzle {
  requiredLetter: string
  otherLetters: string[]
  panagrams: string[]
  validWords: string[]
}

export const generateNDifferentPuzzles = async (n: number): Promise<Puzzle[]> => {
  const words = await readWordlist();
  return generateSpellingPuzzle(words, [], n);
};

const readWordlist = async () => {
  const f = Bun.file('../files/dice.txt');
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
    return generateSpellingPuzzle(words, [...puzzles, puzzle], remainder);
  }

  return generateSpellingPuzzle(words, [...puzzles, puzzle], remainder - 1);
};

const attemptValidLetterCombination = (words: string[]): Puzzle => {
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
  return attemptValidLetterCombination(words);
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
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
    .slice(0, 7);
};

(async () => {
  const n = Number(Bun.argv[2]);
  if (!n || Number.isNaN(n)) {
    console.error("Argument must be a number.");
    process.exit(1);
  }

  const puzzles = await generateNDifferentPuzzles(n);
  console.log(puzzles);
})();