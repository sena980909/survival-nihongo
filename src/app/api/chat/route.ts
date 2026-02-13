import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { stages } from "@/data/stages";
import { dialogueMap } from "@/data/dialogues";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// 힌트 전용 API (파파고 물약)
export async function POST(request: NextRequest) {
  try {
    const { action, stageId, currentStepId } = await request.json();

    if (action !== "hint") {
      return NextResponse.json(
        { error: "Unknown action" },
        { status: 400, headers: corsHeaders }
      );
    }

    const stage = stages.find((s) => s.id === stageId);
    const dialogue = dialogueMap[stageId];
    const step = dialogue?.steps.find((s) => s.id === currentStepId);

    if (!stage || !step) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const bestChoice = step.choices.find((c) => c.quality === "best");

    try {
      const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `당신은 한국인을 위한 일본어 튜터입니다. 간결하게 한국어로 설명하세요.

현재 상황: ${stage.name} (${stage.nameJa})
NPC가 말한 내용: "${step.npcLine}" (${step.npcLineKo})
가장 좋은 대답: "${bestChoice?.text}" (${bestChoice?.textKo})

이 표현이 왜 가장 적절한지, 문법 포인트와 함께 한국어로 간결하게 설명해주세요.
100자 이내로 작성하세요.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });

      return NextResponse.json(
        { hint: completion.choices[0].message.content },
        { headers: corsHeaders }
      );
    } catch {
      return NextResponse.json(
        { hint: bestChoice?.feedback || "가장 자연스러운 표현을 골라보세요!" },
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error("Hint API error:", error);
    return NextResponse.json(
      { error: "Failed to get hint" },
      { status: 500, headers: corsHeaders }
    );
  }
}
