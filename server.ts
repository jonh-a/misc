import { type Server } from "bun";
import { cryptogramSolveHandler } from "./src/cryptograms/cryptograms";
import { spellingGetHandler, spellingGuessHandler } from "./src/spelling/spelling";
import { getCorsHeaders, jsonify } from "./src/util";
import mongoose from "mongoose";

const defaultResponse = () => {
  return jsonify({ error: "not found" }, { status: 404 });
};

mongoose.connect(process.env.MONGO_CONNECTION_STRING || '');

const server = Bun.serve({
  port: 3000,
  async fetch(request: Request, server: Server) {
    // handle options requests
    const corsHeaders = getCorsHeaders(["GET", "POST", "PATCH", "OPTIONS", "PUT"], "*");
    if (request.method === 'OPTIONS') {
      return new Response('Departed', { headers: corsHeaders });
    }

    const pathname: string = new URL(request.url).pathname;
    switch (pathname) {
      case "/spelling": return spellingGetHandler(request);
      case "/spelling/guess": return spellingGuessHandler(request);
      case "/cryptograms/solve": return cryptogramSolveHandler(request, server);
      default: return defaultResponse();
    }
  },
});

console.log(`listening on port ${server.port}...`);