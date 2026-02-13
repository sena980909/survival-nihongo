import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { stages } from "@/data/stages";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const RESPONSE_FORMAT_INSTRUCTION = `
あなたは必ず以下のJSON形式で応答してください。JSON以外の文字は絶対に含めないでください。

{
  "npc_reply": "（日本語でNPCとしての返答）",
  "npc_emotion": "neutral" または "angry" または "happy" または "confused",
  "user_evaluation": {
    "is_natural": true または false,
    "grammar_error": true または false,
    "politeness_level": "polite" または "casual" または "rude"
  },
  "damage": 0から30の数値,
  "feedback": "（韓国語でユーザーへのフィードバック。文法の間違いや改善点を教える）",
  "mission_status": "ongoing" または "success" または "fail"
}

【ダメージ基準】
- 完璧な回答: 0
- 少し不自然: 5-10
- 文法ミスあり: 10-15
- 敬語ミス: 15-20
- 意味が通じない: 20-25
- 完全に的外れ: 25-30
`;

export async function POST(request: NextRequest) {
  try {
    const { stageId, messages, useHint } = await request.json();

    const stage = stages.find((s) => s.id === stageId);
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    const systemMessage = `${stage.systemPrompt}\n\n${RESPONSE_FORMAT_INSTRUCTION}`;

    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "npc" ? "assistant" : ("user" as const),
        content: msg.content,
      })),
    ];

    if (useHint) {
      chatMessages.push({
        role: "user",
        content:
          "【システム】ユーザーがヒントアイテム「パパゴ物薬」を使いました。次の返答に対する完璧な模範解答を韓国語と日本語の両方で feedback フィールドに含めてください。damage は 0 にしてください。npc_reply では通常通りNPCとして会話を続けてください。",
      });
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      temperature: 0.8,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content || "";

    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      parsed = {
        npc_reply: responseText,
        npc_emotion: "neutral",
        user_evaluation: {
          is_natural: true,
          grammar_error: false,
          politeness_level: "polite",
        },
        damage: 0,
        feedback: "",
        mission_status: "ongoing",
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
