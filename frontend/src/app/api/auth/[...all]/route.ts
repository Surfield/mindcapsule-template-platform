import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function proxyRequest(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}${url.pathname}${url.search}`;

  // Get the request body for POST/PUT requests
  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      // No body
    }
  }

  // Forward the request to the backend
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("Content-Type") || "application/json",
      "Cookie": request.headers.get("Cookie") || "",
      "User-Agent": request.headers.get("User-Agent") || "",
    },
    body: body || undefined,
    redirect: "manual",
  });

  // For redirects, return the redirect response
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("Location");
    if (location) {
      const redirectResponse = NextResponse.redirect(location, response.status);

      // Forward Set-Cookie headers
      const setCookieHeaders = response.headers.getSetCookie();
      for (const cookie of setCookieHeaders) {
        redirectResponse.headers.append("Set-Cookie", cookie);
      }

      return redirectResponse;
    }
  }

  // For other responses, proxy the response
  const responseBody = await response.text();
  const nextResponse = new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
  });

  // Copy headers from backend response
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "transfer-encoding") {
      nextResponse.headers.set(key, value);
    }
  });

  return nextResponse;
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}
