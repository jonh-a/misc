import { jsonify, getCorsHeaders } from "../util";
import { type Puzzle, type PuzzleGuess, PuzzleModel } from "./definitions";

export const spellingGetHandler = async (request: Request) => {
  const CORS_HEADERS = getCorsHeaders(["GET", "OPTIONS"], "*");

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

export const spellingGuessHandler = async (request: Request) => {
  const CORS_HEADERS = getCorsHeaders(["POST", "OPTIONS"], "*");

  try {
    if (request.method !== "POST") return jsonify(
      { error: "method not allowed" },
      { status: 400 },
    );

    const { word = "" } = await request.json() as PuzzleGuess;

    if (!word) {
      return jsonify(
        { error: "Guess must not be empty." },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const date = new Date();
    const dateString = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
    const puzzle = await PuzzleModel.findOne({ date: dateString }) as Puzzle;

    if (puzzle.panagrams.includes(word.toLowerCase())) {
      return jsonify(
        {
          response: 'panagram',
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        },
        { status: 200 },
      )
    }

    if (puzzle.validWords.includes(word.toLowerCase())) {
      return jsonify(
        {
          response: 'word',
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        },
        { status: 200 },
      )
    }

    if (!puzzle.validWords.includes(word.toLowerCase())) {
      return jsonify(
        {
          response: 'invalid',
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        },
        { status: 200 },
      )
    }

    return jsonify(
      {
        error: 'An unexpected error occurred.',
      },
      { status: 200 },
    )
  } catch (e) {
    console.log(e);
    return jsonify(
      { error: "an unexpected error occurred" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}