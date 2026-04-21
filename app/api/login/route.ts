import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch(
    "http://127.0.0.1:8001/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, {
      status: backendRes.status
    });
  }

  const response = NextResponse.json(data);

  response.cookies.set("token", "loggedin", {
    httpOnly: true,
    path: "/"
  });

  response.cookies.set("role", data.role, {
    httpOnly: true,
    path: "/"
  });

  return response;
}