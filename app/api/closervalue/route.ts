import { NextResponse } from "next/server";
import {
  CLOSERVALUE_SYSTEM_PROMPT,
  parseCloserValueResponse,
} from "@/lib/closervalue";

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.XAI_API_KEY),
    model: process.env.XAI_MODEL ?? "grok-3-mini",
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "CloserValue AI is not configured yet. Please try again later." },
      { status: 503 }
    );
  }

  let body: { title?: string; category?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = body.title?.trim();
  const category = body.category?.trim();

  if (!title || title.length < 2) {
    return NextResponse.json({ error: "Please enter an item title." }, { status: 400 });
  }

  if (!category) {
    return NextResponse.json({ error: "Please select a category." }, { status: 400 });
  }

  if (title.length > 200) {
    return NextResponse.json({ error: "Title must be 200 characters or fewer." }, { status: 400 });
  }

  const model = process.env.XAI_MODEL ?? "grok-3-mini";

  const requestBody: Record<string, unknown> = {
    model,
    temperature: 0.3,
    max_completion_tokens: 400,
    messages: [
      { role: "system", content: CLOSERVALUE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Item: "${title}"\nCategory: ${category}\nToday's date: June 2026`,
      },
    ],
    search_parameters: {
      mode: "auto",
      max_search_results: 5,
      return_citations: false,
    },
  };

  if (model.includes("grok-4")) {
    requestBody.reasoning_effort = "none";
  }

  try {
    const response = await fetch(XAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("xAI API error:", response.status, errText);
      return NextResponse.json(
        { error: "Unable to generate an estimate right now. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Received an empty response from the pricing model." },
        { status: 502 }
      );
    }

    const result = parseCloserValueResponse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("CloserValue AI failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}