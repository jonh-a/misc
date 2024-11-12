const readWordlist = async () => {
  const f = Bun.file('../files/dice.txt')
  const words = (await f.text()).split('\n')
  return words;
}

const generateSpellingPuzzle = async () => {
  const words = await readWordlist()

  const letters = attemptValidLetterCombination(words)
  console.log(letters)
}

const attemptValidLetterCombination = (words: string[]): {
  requiredLetter: string,
  otherLetters: string[],
  panagrams: string[],
  validWords: string[],
} => {
  const letters = getRandomLetters()
  const [requiredLetter, ...otherLetters] = letters
  const validWords = words.filter((word: string) => {
    const wordSet = new Set(Array.from(word))
    const possibleLettersSet = new Set(letters)
    return (
      wordSet.has(requiredLetter)
      && possibleLettersSet.isSupersetOf(wordSet)
      && word.length > 3
    )
  })

  const panagrams = getPanagrams(letters, validWords)

  if (panagrams.length >= 1 && validWords.length > 10) {
    return { requiredLetter, otherLetters, panagrams, validWords }
  }
  return attemptValidLetterCombination(words)
}

const getPanagrams = (letters: string[], words: string[]) => {
  const letterSet = new Set(letters)

  const panagrams = words.filter((word: string) => {
    const wordSet = new Set(Array.from(word))
    return (letterSet.isSupersetOf(wordSet) && letterSet.isSubsetOf(wordSet))
  })

  return panagrams
}

const getRandomLetters = () => {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
    .slice(0, 7)
};

await generateSpellingPuzzle()