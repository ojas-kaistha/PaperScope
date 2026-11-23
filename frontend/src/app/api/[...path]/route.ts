import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

async function handleProxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const subPath = (params.path || []).join("/");
  const targetUrl = new URL(`/api/${subPath}`, BACKEND_URL);
  
  // Forward search query parameters (?doc_id=... etc.)
  targetUrl.search = req.nextUrl.search;

  // Build clean forwarding headers
  const forwardHeaders = new Headers();
  req.headers.forEach((val, key) => {
    const lower = key.toLowerCase();
    if (lower !== "host" && lower !== "connection" && lower !== "content-length") {
      forwardHeaders.set(key, val);
    }
  });

  const fetchOptions: RequestInit = {
    method: req.method,
    headers: forwardHeaders,
    cache: "no-store",
    // Allow up to 5 minutes for heavy PDF processing/OCR without proxy abort
    signal: AbortSignal.timeout(300000),
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const bodyBuffer = await req.arrayBuffer();
    if (bodyBuffer.byteLength > 0) {
      fetchOptions.body = bodyBuffer;
    }
  }

  try {
    const backendRes = await fetch(targetUrl.toString(), fetchOptions);

    const resHeaders = new Headers();
    backendRes.headers.forEach((val, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        resHeaders.set(key, val);
      }
    });

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error(`[PaperScope Proxy] Error forwarding to ${targetUrl.toString()}:`, err.message);
    return NextResponse.json(
      {
        detail: `Failed to connect to local backend at ${BACKEND_URL}. Please ensure 'run_backend.bat' is running.`,
        error: err.message,
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const OPTIONS = handleProxy;
