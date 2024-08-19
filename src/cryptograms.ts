import { type Server } from "bun"
import { jsonify, getCorsHeaders } from "./util"
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
    if (request.method !== "POST") {
      return jsonify({ error: "method not allowed" }, { status: 400 })
    }

    const ipAddress: string = server.requestIP(request)?.address || "N/A"
    const { puzzle = "", solveTime = 0 } = await request.json() as ISubmission

    if (puzzle === "" || solveTime <= 3) {
      return jsonify(
        { error: "invalid parameters" },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const submisson: ISubmission = {
      puzzle,
      solveTime,
      ipAddress,
      solvedAt: new Date(),
    }

    return jsonify(
      submisson,
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