import { describe, it, expect } from 'bun:test';
import { generateNDifferentPuzzles } from '../src/spelling/scripts/generateSpellingPuzzles';

describe('Spelling puzzle generation', () => {
  it('should return a valid puzzle object', async () => {
    const puzzles = await generateNDifferentPuzzles(1);
    expect(puzzles).toBeInstanceOf(Array);
    expect(puzzles.length).toBe(1);
  });
});