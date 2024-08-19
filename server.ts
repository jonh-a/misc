import { type Server } from "bun"
import { cryptogramSolveHandler } from "./src/cryptograms";
import { jsonify } from "./src/util";

const defaultResponse = () => {
  return jsonify({ error: "not found" }, { status: 404 })
}

const server = Bun.serve({
  port: 3000,
  async fetch(request: Request, server: Server) {
    const pathname: string = new URL(request.url).pathname
    switch (pathname) {
      case "/cryptograms/solve": return cryptogramSolveHandler(request, server)
      default: return defaultResponse()
    }
  },
});

console.log(`listening on port ${server.port}...`);