import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { scenarios } from "@/data/scenarios";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const RESPONSE_FORMAT_INSTRUCTION = `
あなたは必ず以下のJSON形式のみで応答してください。
JSONの前後にマークダウンのコードブロック記号は絶対に含めないでください。純粋なJSONのみを返してください。

{
  "npc_reply": "（日本語でNPCとしての返答。必ず何か言ってください）",
  "npc_reply_ko": "（npc_replyの韓国語翻訳）",
  "npc_reply_pronunciation": "（日本語の音を韓国語の文字で表記。意味の翻訳ではない！例：パスポートを見せてください→파스포-토오 미세테쿠다사이）",
  "npc_emotion": "neutral",
  "choices": [
    {
      "text": "（日本語の選択肢1 - 最も適切な回答）",
      "text_ko": "（韓国語の意味翻訳）",
      "text_pronunciation": "（日本語の音を韓国語で表記。例：はい→하이、ありがとう→아리가또）",
      "quality": "best"
    },
    {
      "text": "（日本語の選択肢2 - まあまあの回答）",
      "text_ko": "（韓国語の意味翻訳）",
      "text_pronunciation": "（日本語の音を韓国語で表記）",
      "quality": "acceptable"
    },
    {
      "text": "（日本語の選択肢3 - 不適切な回答）",
      "text_ko": "（韓国語の意味翻訳）",
      "text_pronunciation": "（日本語の音を韓国語で表記）",
      "quality": "poor"
    }
  ],
  "conversation_status": "ongoing"
}

【重要ルール】
- npc_reply: NPCのセリフ（日本語）。必ず入れること。
- npc_reply_ko: NPCのセリフの韓国語翻訳。
- npc_reply_pronunciation: 日本語の音を韓国語の文字で書いたもの。意味の翻訳ではなく、日本語をそのまま韓国語の文字で発音表記する。
  例：「パスポートを見せてください」→「파스포-토오 미세테쿠다사이」
  例：「ありがとうございます」→「아리가또고자이마스」
  例：「すみません」→「스미마셍」
  ※ 韓国語の意味翻訳（例：여권을 보여주세요）を入れてはいけない！
- npc_emotion: "neutral", "happy", "confused", "encouraging" のいずれか。
- choices: 必ず3つの選択肢を提供。ユーザーが次に言うべきセリフの候補。
  - quality は "best", "acceptable", "poor" のいずれか。
  - 選択肢の順番は毎回ランダムにすること（bestを常に最初にしない）。
  - text_ko: 韓国語の意味翻訳（例：네, 이것이 제 여권입니다）
  - text_pronunciation: 日本語の音を韓国語で表記（例：하이, 코치라가 와타시노 파스포-토데스）。text_koと同じ内容を入れてはいけない！
- conversation_status: "ongoing" または "completed"（会話の目標を全て達成した場合）。
`;

const EVALUATE_FORMAT_INSTRUCTION = `
ユーザーが選択肢を選びました。その選択に対して教育的フィードバックを提供し、会話を続けてください。
必ず以下のJSON形式のみで応答してください。

{
  "npc_reply": "（選択に対するNPCの日本語返答）",
  "npc_reply_ko": "（npc_replyの韓国語翻訳）",
  "npc_reply_pronunciation": "（npc_replyの韓国語発音表記）",
  "npc_emotion": "neutral",
  "correction": {
    "was_correct": true,
    "explanation": "（韓国語で説明。選んだ表現がなぜ適切/不適切か）",
    "better_expression": "（より自然な日本語表現。was_correctがfalseの場合）",
    "better_expression_ko": "（better_expressionの韓国語翻訳）",
    "better_expression_pronunciation": "（better_expressionの韓国語発音表記）",
    "grammar_point": "（学んだ文法ポイントを韓国語で簡潔に説明）"
  },
  "kanji_note": null,
  "choices": [
    {
      "text": "（次の選択肢1）",
      "text_ko": "（韓国語翻訳）",
      "text_pronunciation": "（韓国語発音表記）",
      "quality": "best"
    },
    {
      "text": "（次の選択肢2）",
      "text_ko": "（韓国語翻訳）",
      "text_pronunciation": "（韓国語発音表記）",
      "quality": "acceptable"
    },
    {
      "text": "（次の選択肢3）",
      "text_ko": "（韓国語翻訳）",
      "text_pronunciation": "（韓国語発音表記）",
      "quality": "poor"
    }
  ],
  "conversation_status": "ongoing"
}

【フィードバック基準】
- best を選んだ場合: was_correct: true, 褒めて文法ポイントを説明。better_expressionは不要。
- acceptable を選んだ場合: was_correct: true だが、より自然な表現を better_expression で紹介。
- poor を選んだ場合: was_correct: false, なぜ不適切か優しく説明し、正しい表現を示す。

【漢字ノート】
- 会話の中で漢字が重要な役割を果たす場面では、kanji_note を含める：
  {
    "kanji": "漢字",
    "reading": "ひらがな読み",
    "pronunciation": "韓国語発音（例：でぐち→데구치）",
    "meaning": "韓国語の意味",
    "explanation": "漢字の成り立ちや覚え方を韓国語で説明"
  }
- 漢字が関連しない場面では kanji_note: null

【重要】
- conversation_status は会話の流れに応じて判断。目標を全て達成したら "completed"。失敗はない。
- 選択肢の順番はランダムにすること。
- correction.explanation は韓国語で、選んだ表現がなぜ良い/悪いかを優しく説明すること。
`;

export async function POST(request: NextRequest) {
  try {
    const { scenarioId, messages, requestHelp, isInitial } =
      await request.json();

    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [];

    if (isInitial) {
      chatMessages.push({
        role: "system",
        content: `${scenario.systemPrompt}\n\n${RESPONSE_FORMAT_INSTRUCTION}`,
      });
      chatMessages.push({
        role: "user",
        content:
          "【システム指示】会話開始。NPCとして最初の一言を言い、ユーザーが返答するための3つの選択肢を提示してください。",
      });
    } else {
      chatMessages.push({
        role: "system",
        content: `${scenario.systemPrompt}\n\n${EVALUATE_FORMAT_INSTRUCTION}`,
      });
      chatMessages.push(
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role === "npc" ? ("assistant" as const) : ("user" as const),
          content: msg.content,
        }))
      );
    }

    if (requestHelp) {
      chatMessages.push({
        role: "user",
        content:
          "【システム】ユーザーがヘルプを求めています。各選択肢の意味、ニュアンス、使用場面の違いを韓国語で丁寧に説明してください。どれが正解かは直接言わず、ユーザー自身が判断できるようにヒントを出してください。韓国語発音表記も含めてください。",
      });
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      temperature: 0.8,
      max_tokens: 1200,
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
        npc_reply_pronunciation: "스미마셍, 모-이치도 오네가이시마스",
        npc_emotion: "confused",
        correction: null,
        kanji_note: null,
        choices: [
          {
            text: "はい、わかりました。",
            text_ko: "네, 알겠습니다.",
            text_pronunciation: "하이, 와카리마시타",
            quality: "best",
          },
          {
            text: "えっと...",
            text_ko: "음...",
            text_pronunciation: "엣또...",
            quality: "acceptable",
          },
          {
            text: "何ですか？",
            text_ko: "뭐요?",
            text_pronunciation: "난데스카?",
            quality: "poor",
          },
        ],
        conversation_status: "ongoing",
      };
    }

    // npc_reply 빈 값 방지
    if (!parsed.npc_reply || parsed.npc_reply.trim() === "") {
      parsed.npc_reply = "すみません、もう一度お願いします。";
      parsed.npc_reply_ko = "죄송합니다, 다시 한번 부탁드립니다.";
      parsed.npc_reply_pronunciation = "스미마셍, 모-이치도 오네가이시마스";
    }

    // choices가 없거나 비어있으면 기본값
    if (
      !parsed.choices ||
      !Array.isArray(parsed.choices) ||
      parsed.choices.length === 0
    ) {
      parsed.choices = [
        {
          text: "はい。",
          text_ko: "네.",
          text_pronunciation: "하이",
          quality: "best",
        },
        {
          text: "いいえ。",
          text_ko: "아니요.",
          text_pronunciation: "이-에",
          quality: "acceptable",
        },
        {
          text: "もう一度お願いします。",
          text_ko: "다시 한번 부탁합니다.",
          text_pronunciation: "모-이치도 오네가이시마스",
          quality: "poor",
        },
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
