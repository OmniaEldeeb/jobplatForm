import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  const res = await fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  return new Response(buffer, {
    headers: { "content-type": contentType },
  });
}