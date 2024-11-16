import { Schema, model } from "mongoose";

export interface Puzzle {
  date?: string
  requiredLetter: string
  otherLetters: string[]
  panagrams: string[]
  validWords: string[]
}

export const PuzzleModel = model<Puzzle>(
  'spelling_puzzles',
  new Schema<Puzzle>({
    date: { type: String, required: true },
    requiredLetter: { type: String, required: true },
    otherLetters: { type: [String], required: true },
    panagrams: { type: [String], required: true },
    validWords: { type: [String], required: true },
  })
);