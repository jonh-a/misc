import { type Server } from "bun"
import { jsonify, getCorsHeaders, round } from "./util"
import { Schema, model } from "mongoose"

interface ISubmission {
  puzzle: string
  solveTime: number
  ipAddress: string
  solvedAt: Date
}

const SubmissionModel = model<ISubmission>(
  'cryptogramSubmission',
  new Schema<ISubmission>({
    puzzle: { type: String, required: true },
    solveTime: { type: Number, required: true },
    solvedAt: { type: Date, required: true },
    ipAddress: { type: String, required: true },
  })
)

export const cryptogramSolveHandler = async (request: Request, server: Server) => {
  const CORS_HEADERS = getCorsHeaders(["POST", "OPTIONS"], "*")

  try {
    if (request.method !== "POST") return jsonify(
      { error: "method not allowed" },
      { status: 400 },
    )

    const ipAddress: string = server.requestIP(request)?.address || "N/A"
    const { puzzle = "", solveTime = 0 } = await request.json() as ISubmission

    if (puzzle === "" || solveTime <= 3) {
      return jsonify(
        { error: "invalid parameters" },
        { status: 400, headers: CORS_HEADERS },
      )
    }

    const submission = new SubmissionModel({
      puzzle,
      solveTime,
      ipAddress,
      solvedAt: new Date(),
    });

    await submission.save()
    const submissions = await SubmissionModel.find({ puzzle }) as ISubmission[]

    if (submissions.length === 0) return jsonify(
      { error: "something unexpected happened" },
      { status: 500, headers: CORS_HEADERS },
    )

    const average = round(submissions
      .map((submission: ISubmission) => submission.solveTime)
      .reduce((a, b) => a + b) / submissions.length
    )

    return jsonify(
      { puzzle, average, time: solveTime },
      { headers: CORS_HEADERS },
    )
  } catch (e) {
    console.log(e)
    return jsonify(
      { error: "an unexpected error occurred" },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}