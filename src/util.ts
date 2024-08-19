export const jsonify = (
  body: object,
  init?: { status?: number, headers?: object }
): Response => {
  return new Response(
    JSON.stringify(body), {
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
    status: init?.status ?? 200
  });
}

export const getCorsHeaders = (
  methods: string[],
  origins: string,
) => ({
  'Access-Control-Allow-Origin': `${origins ?? "*"}`,
  'Access-Control-Allow-Methods': `${methods.join(", ")}`,
  'Access-Control-Allow-Headers': 'Content-Type',
})