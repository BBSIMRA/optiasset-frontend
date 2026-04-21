import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://127.0.0.1:8001/users/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status
    });

  } catch (error) {
    return NextResponse.json(
      { detail: "Signup server error" },
      { status: 500 }
    );
  }
}