import { jsonify, getCorsHeaders } from "../util";
import { type Puzzle, type PuzzleGuess, PuzzleModel } from "./definitions";
import { UserFacingError } from "../util";

export const spellingGetHandler = async (request: Request) => {
  const CORS_HEADERS = getCorsHeaders(["GET", "OPTIONS"], "*");

  try {
    if (request.method !== "GET") return jsonify(
      { error: "method not allowed" },
      { status: 400 },
    );

    const { searchParams } = new URL(request.url);
    const dateInput = searchParams.get('date') || '';
    const date = getDateString(dateInput);
    const puzzle = await PuzzleModel.findOne({ date }) as Puzzle;
    if (!puzzle) throw new UserFacingError(`Puzzle not found for date ${dateInput}.`);

    return jsonify(
      {
        puzzle: {
          date: puzzle.date,
          requiredLetter: puzzle.requiredLetter,
          otherLetters: puzzle.otherLetters,
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        }
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof UserFacingError) {
      return jsonify(
        { error: error.message },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    return jsonify(
      { error: 'An unexpected error occurred.' },
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

    const { searchParams } = new URL(request.url);
    const dateInput = searchParams.get('date') || '';
    const date = getDateString(dateInput);
    const puzzle = await PuzzleModel.findOne({ date }) as Puzzle;
    if (!puzzle) throw new UserFacingError(`Puzzle not found for date ${dateInput}.`);

    if (puzzle.panagrams.includes(word.toLowerCase())) {
      return jsonify(
        {
          date: puzzle.date,
          response: 'panagram',
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        },
        { status: 200 },
      );
    }

    if (puzzle.validWords.includes(word.toLowerCase())) {
      return jsonify(
        {
          date: puzzle.date,
          response: 'word',
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        },
        { status: 200 },
      );
    }

    if (!puzzle.validWords.includes(word.toLowerCase())) {
      return jsonify(
        {
          date: puzzle.date,
          response: 'invalid',
          panagramCount: puzzle.panagrams.length,
          validWordCount: puzzle.validWords.length,
        },
        { status: 200 },
      );
    }

    return jsonify(
      {
        error: 'An unexpected error occurred.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof UserFacingError) {
      return jsonify(
        { error: error.message },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    return jsonify(
      { error: 'An unexpected error occurred.' },
      { status: 500, headers: CORS_HEADERS },
    );
  }
};

const getDateString = (dateInput: string): string => {
  let date: Date;
  if (!dateInput) date = new Date();
  else date = new Date(dateInput);

  if (isNaN(date.getTime())) throw new UserFacingError('Invalid date provided.');

  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
};