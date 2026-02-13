import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { stages } from "@/data/stages";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const RESPONSE_FORMAT_INSTRUCTION = `
あなたは必ず以下のJSON形式のみで応答してください。
JSONの前後にマークダウンのコードブロック記号は絶対に含めないでください。純粋なJSONのみを返してください。

{
  "npc_reply": "（日本語でNPCとしての返答。必ず何か言ってください）",
  "npc_reply_ko": "（npc_replyの韓国語翻訳）",
  "npc_emotion": "neutral",
  "choices": [
    {
      "text": "（日本語の選択肢1 - 最も適切な回答）",
      "text_ko": "（韓国語翻訳）",
      "is_best": true
    },
    {
      "text": "（日本語の選択肢2 - まあまあの回答）",
      "text_ko": "（韓国語翻訳）",
      "is_best": false
    },
    {
      "text": "（日本語の選択肢3 - 不適切な回答）",
      "text_ko": "（韓国語翻訳）",
      "is_best": false
    }
  ],
  "mission_status": "ongoing"
}

【重要ルール】
- npc_reply: NPCのセリフ（日本語）。必ず入れること。
- npc_reply_ko: NPCのセリフの韓国語翻訳。
- npc_emotion: "neutral", "angry", "happy", "confused" のいずれか。
- choices: 必ず3つの選択肢を提供。ユーザーが次に言うべきセリフの候補。
  - 1つは最も適切（is_best: true）、残りは不適切または微妙な回答。
  - 選択肢の順番はランダムにすること（正解を常に最初にしない）。
  - 各選択肢に日本語(text)と韓国語翻訳(text_ko)を含める。
- mission_status: "ongoing", "success", "fail" のいずれか。
`;

const EVALUATE_FORMAT_INSTRUCTION = `
ユーザーが選択肢を選びました。その選択に対して評価し、会話を続けてください。
必ず以下のJSON形式のみで応答してください。

{
  "npc_reply": "（選択に対するNPCの日本語返答）",
  "npc_reply_ko": "（npc_replyの韓国語翻訳）",
  "npc_emotion": "neutral",
  "damage": 0,
  "feedback": "（韓国語でフィードバック。なぜこの表現が良い/悪いか説明）",
  "choices": [
    {
      "text": "（次の選択肢1）",
      "text_ko": "（韓国語翻訳）",
      "is_best": true
    },
    {
      "text": "（次の選択肢2）",
      "text_ko": "（韓国語翻訳）",
      "is_best": false
    },
    {
      "text": "（次の選択肢3）",
      "text_ko": "（韓国語翻訳）",
      "is_best": false
    }
  ],
  "mission_status": "ongoing"
}

【ダメージ基準】
- 最も適切な選択肢を選んだ場合: 0
- まあまあの選択肢を選んだ場合: 5-10
- 不適切な選択肢を選んだ場合: 15-25

【重要】
- mission_status は会話の流れに応じて判断。ミッション目標を達成したら "success"。
- 選択肢の順番はランダムにすること。
- feedback は韓国語で、選んだ表現がなぜ良い/悪いかを説明すること。
`;

export async function POST(request: NextRequest) {
  try {
    const { stageId, messages, useHint, isInitial } = await request.json();

    const stage = stages.find((s) => s.id === stageId);
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [];

    if (isInitial) {
      chatMessages.push({
        role: "system",
        content: `${stage.systemPrompt}\n\n${RESPONSE_FORMAT_INSTRUCTION}`,
      });
      chatMessages.push({
        role: "user",
        content:
          "【システム指示】会話開始。NPCとして最初の一言を言い、ユーザーが返答するための3つの選択肢を提示してください。",
      });
    } else {
      chatMessages.push({
        role: "system",
        content: `${stage.systemPrompt}\n\n${EVALUATE_FORMAT_INSTRUCTION}`,
      });
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
          "【システム】ヒント使用。選択肢のうちどれが最適かを feedback で韓国語で詳しく説明してください。damage は 0 にしてください。",
      });
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      temperature: 0.8,
      max_tokens: 800,
    });

    const responseText = completion.choices[0].message.content || "";

    let parsed;
    try {
      const cleaned = responseText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch {
      parsed = {
        npc_reply: "すみません、もう一度お願いします。",
        npc_reply_ko: "죄송합니다, 다시 한번 부탁드립니다.",
        npc_emotion: "confused",
        damage: 0,
        feedback: "",
        choices: [
          { text: "はい、わかりました。", text_ko: "네, 알겠습니다.", is_best: true },
          { text: "えっと...", text_ko: "음...", is_best: false },
          { text: "何ですか？", text_ko: "뭐요?", is_best: false },
        ],
        mission_status: "ongoing",
      };
    }

    // npc_reply 빈 값 방지
    if (!parsed.npc_reply || parsed.npc_reply.trim() === "") {
      parsed.npc_reply = "すみません、もう一度お願いします。";
      parsed.npc_reply_ko = "죄송합니다, 다시 한번 부탁드립니다.";
    }

    // choices가 없거나 비어있으면 기본값
    if (!parsed.choices || !Array.isArray(parsed.choices) || parsed.choices.length === 0) {
      parsed.choices = [
        { text: "はい。", text_ko: "네.", is_best: true },
        { text: "いいえ。", text_ko: "아니요.", is_best: false },
        { text: "もう一度お願いします。", text_ko: "다시 한번 부탁합니다.", is_best: false },
      ];
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
