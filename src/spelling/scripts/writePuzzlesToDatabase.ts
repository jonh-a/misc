/*
  Add dates to a JSON file of puzzles and insert them into the database.

  Example:
  # Add dates starting with 2024-01-01 to a list of puzzles 
  # and insert them into the spelling_puzzles collection
  bun run src/spelling/scripts/writePuzzlesToDatabase.ts puzzles.json 2024-01-01
*/

import { type Puzzle, PuzzleModel } from "../definitions";
import mongoose from "mongoose";

export const writePuzzlesToDatabase = async (
  puzzles: Puzzle[],
  startDate: Date
) => {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING || '');

  const puzzlesWithDates = puzzles.map((puzzle: Puzzle) => {
    const puzzleWithDate = {
      ...puzzle,
      date: `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()}`
    };

    startDate.setUTCDate(startDate.getUTCDate() + 1);
    return puzzleWithDate;
  });

  try {
    await PuzzleModel.insertMany(puzzlesWithDates);
    console.log('Data successfully inserted.');
  } catch (e) {
    console.error('An unexpected error occurred:', e);
  }
};

const readJsonFile = async (path: string): Promise<Puzzle[]> => {
  const f = Bun.file(path);
  const puzzles = JSON.parse(await f.text());
  return puzzles;
};

if (import.meta.main) {
  (async () => {
    const pathToPuzzles = Bun.argv[2];
    const startDate = new Date(Bun.argv[3]);

    if (Number.isNaN(startDate.getTime())) {
      console.error("Argument must be a valid date (YYYY-MM-DD).");
      process.exit(1);
    }
    const puzzles = await readJsonFile(pathToPuzzles);

    await writePuzzlesToDatabase(puzzles, startDate);
  })();
}