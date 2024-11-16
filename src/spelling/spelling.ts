import { jsonify, getCorsHeaders } from "../util";
import { type Puzzle, PuzzleModel } from "./definitions";

export const spellingGetHandler = async (request: Request) => {
  const CORS_HEADERS = getCorsHeaders(["GET", "POST", "OPTIONS"], "*");

  try {
    if (request.method !== "GET") return jsonify(
      { error: "method not allowed" },
      { status: 400 },
    );

    const date = new Date();
    const dateString = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
    const puzzle = await PuzzleModel.findOne({ date: dateString }) as Puzzle;

    return jsonify(
      {
        puzzle: {
          requiredLetter: puzzle.requiredLetter,
          otherLetters: puzzle.otherLetters,
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        }
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return jsonify(
      { error: "an unexpected error occurred" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
};