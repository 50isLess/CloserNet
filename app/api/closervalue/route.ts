import { NextResponse } from "next/server";
import { parseCloserValueResponse } from "@/lib/closervalue";

export const runtime = "nodejs";

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";
const DEFAULT_MODEL = "grok-3-latest";

export async function GET() {
  const apiKey = process.env.XAI_API_KEY?.trim();
  return NextResponse.json({
    configured: Boolean(apiKey),
    model: process.env.XAI_MODEL?.trim() ?? DEFAULT_MODEL,
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.XAI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "CloserValue AI is not configured. Add XAI_API_KEY in Vercel → Settings → Environment Variables (Production), then redeploy.",
      },
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

  const model = process.env.XAI_MODEL?.trim() ?? DEFAULT_MODEL;

  const prompt = `You are a pricing expert for a modern peer-to-peer marketplace like CloserNet.
A seller wants to list: "${title}" in the "${category}" category.
Give a realistic low and high price range they should list it at, based on current market value.
Also give a short one-sentence reason.
Return ONLY valid JSON in this exact format:
{
  "low": 120,
  "high": 165,
  "reason": "Recent similar sales show strong demand in this range."
}`;

  try {
    const response = await fetch(XAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful and accurate pricing assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("xAI API error:", response.status, errText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid XAI_API_KEY. Generate a new key at console.x.ai and update Vercel." },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: "Unable to generate an estimate right now. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Received an empty response from Grok." },
        { status: 502 }
      );
    }

    let result;
    try {
      result = parseCloserValueResponse(content);
    } catch {
      try {
        result = parseCloserValueResponse(
          JSON.stringify({
            low: 80,
            high: 200,
            reason: content.trim() || "Based on current market trends.",
          })
        );
      } catch {
        result = {
          low: 80,
          high: 200,
          message: content.trim() || "Based on current market trends.",
          reason: content.trim() || "Based on current market trends.",
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("CloserValue API Error:", error);
    return NextResponse.json(
      { error: "Failed to get price from Grok" },
      { status: 500 }
    );
  }
}