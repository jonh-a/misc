import { type Server } from "bun"
import { jsonify, getCorsHeaders } from "./util"

export const spellingBeeHandler = async (request: Request, server: Server) => {
  const CORS_HEADERS = getCorsHeaders(["GET", "POST", "OPTIONS"], "*")

  try {
    if (request.method === "GET") return jsonify(
      { error: "method not allowed" },
      { status: 400 },
    )
  }

  catch (e) {
    console.log(e)
    return jsonify(
      { error: "an unexpected error occurred" },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}