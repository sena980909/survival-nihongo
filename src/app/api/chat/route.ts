import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { stages } from "@/data/stages";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const RESPONSE_FORMAT_INSTRUCTION = `
あなたは必ず以下のJSON形式のみで応答してください。JSONの前後に余計な文字やマークダウンのコードブロック記号（\`\`\`）は絶対に含めないでください。純粋なJSONのみを返してください。

{
  "npc_reply": "（日本語でNPCとしての返答。必ず何か言ってください）",
  "npc_emotion": "neutral",
  "user_evaluation": {
    "is_natural": true,
    "grammar_error": false,
    "politeness_level": "polite"
  },
  "damage": 0,
  "feedback": "（韓国語でユーザーへのフィードバック）",
  "mission_status": "ongoing"
}

npc_emotion は "neutral", "angry", "happy", "confused" のいずれか。
damage は 0~30 の数値。
mission_status は "ongoing", "success", "fail" のいずれか。

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
    const { stageId, messages, useHint, isInitial } = await request.json();

    const stage = stages.find((s) => s.id === stageId);
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    let systemMessage = `${stage.systemPrompt}\n\n${RESPONSE_FORMAT_INSTRUCTION}`;

    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
    ];

    if (isInitial) {
      // 초기 대화: NPC가 먼저 말하도록
      chatMessages.push({
        role: "user",
        content:
          "【システム指示】会話の最初です。NPCとして最初の一言を言ってください。ユーザーはまだ何も言っていません。damage は 0、feedback は空文字にしてください。npc_reply には必ずNPCの最初のセリフを入れてください。",
      });
    } else {
      // 일반 대화
      chatMessages.push(
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role === "npc" ? ("assistant" as const) : ("user" as const),
          content: msg.content,
        }))
      );
    }

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
      // 마크다운 코드블록 제거
      const cleaned = responseText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch {
      // JSON 파싱 실패 시 텍스트를 npc_reply로 사용
      parsed = {
        npc_reply: responseText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").replace(/[{}]/g, "").trim() || "すみません、もう一度お願いします。",
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

    // npc_reply가 비어있으면 fallback
    if (!parsed.npc_reply || parsed.npc_reply.trim() === "") {
      parsed.npc_reply = "すみません、もう一度お願いします。";
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
