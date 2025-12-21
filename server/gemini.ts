import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";
import OpenAI from "openai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// OpenAI client for pet training AI functions (Gemini API key expired)
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_TALEZ || process.env.OPENAI_API_KEY 
});

export async function summarizeArticle(text: string): Promise<string> {
    const prompt = `Please summarize the following text concisely while maintaining key points:\n\n${text}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text || "Something went wrong";
}

export interface Sentiment {
    rating: number;
    confidence: number;
}

export async function analyzeSentiment(text: string): Promise<Sentiment> {
    try {
        const systemPrompt = `You are a sentiment analysis expert. 
Analyze the sentiment of the text and provide a rating
from 1 to 5 stars and a confidence score between 0 and 1.
Respond with JSON in this format: 
{'rating': number, 'confidence': number}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        rating: { type: "number" },
                        confidence: { type: "number" },
                    },
                    required: ["rating", "confidence"],
                },
            },
            contents: text,
        });

        const rawJson = response.text;

        console.log(`Raw JSON: ${rawJson}`);

        if (rawJson) {
            const data: Sentiment = JSON.parse(rawJson);
            return data;
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        throw new Error(`Failed to analyze sentiment: ${error}`);
    }
}

export async function analyzeImage(jpegImagePath: string): Promise<string> {
    const imageBytes = fs.readFileSync(jpegImagePath);

    const contents = [
        {
            inlineData: {
                data: imageBytes.toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        `Analyze this image in detail and describe its key elements, context,
and any notable aspects.`,
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
    });

    return response.text || "";
}

export async function analyzeVideo(mp4VideoPath: string): Promise<string> {
    const videoBytes = fs.readFileSync(mp4VideoPath);

    const contents = [
        {
            inlineData: {
                data: videoBytes.toString("base64"),
                mimeType: "video/mp4",
            },
        },
        `Analyze this video in detail and describe its key elements, context,
    and any notable aspects.`,
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
    });

    return response.text || "";
}

export async function generateImage(
    prompt: string,
    imagePath: string,
): Promise<void> {
    try {
        // IMPORTANT: only this gemini model supports image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            return;
        }

        const content = candidates[0].content;
        if (!content || !content.parts) {
            return;
        }

        for (const part of content.parts) {
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = Buffer.from(part.inlineData.data, "base64");
                fs.writeFileSync(imagePath, imageData);
                console.log(`Image saved as ${imagePath}`);
            }
        }
    } catch (error) {
        throw new Error(`Failed to generate image: ${error}`);
    }
}

// 펫 훈련 관련 AI 분석 함수들 - OpenAI GPT-4.1 사용
export async function analyzePetBehavior(description: string): Promise<string> {
    const prompt = `반려동물 행동 전문가로서 다음 행동을 분석하고 훈련 조언을 제공하세요:

행동 설명: ${description}

다음 형식으로 답변해주세요:
1. 행동 분석
2. 가능한 원인
3. 훈련 방법
4. 주의사항

전문적이고 실용적인 조언을 한국어로 제공해주세요.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: "당신은 반려동물 행동 전문가입니다. 전문적이고 실용적인 조언을 한국어로 제공합니다." },
            { role: "user", content: prompt }
        ],
    });

    return response.choices[0].message.content || "분석을 완료할 수 없습니다.";
}

export async function generateTrainingPlan(petInfo: {
    breed: string;
    age: string;
    issue: string;
    experience: string;
}): Promise<string> {
    const prompt = `반려견 훈련 전문가로서 맞춤형 훈련 계획을 작성해주세요:

반려견 정보:
- 견종: ${petInfo.breed}
- 나이: ${petInfo.age}
- 문제 행동: ${petInfo.issue}
- 주인 경험: ${petInfo.experience}

다음 형식으로 4주 훈련 계획을 작성해주세요:
1주차: [목표 및 방법]
2주차: [목표 및 방법]
3주차: [목표 및 방법]
4주차: [목표 및 방법]

각 주차별로 구체적인 훈련 방법과 주의사항을 포함해주세요.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: "당신은 반려견 훈련 전문가입니다. 체계적이고 실용적인 훈련 계획을 한국어로 작성합니다." },
            { role: "user", content: prompt }
        ],
    });

    return response.choices[0].message.content || "훈련 계획을 생성할 수 없습니다.";
}

export async function analyzeHealthSymptoms(symptoms: string): Promise<string> {
    const prompt = `수의사 관점에서 다음 증상을 분석하고 조언을 제공하세요:

증상: ${symptoms}

다음 형식으로 답변해주세요:
1. 증상 분석
2. 가능한 원인
3. 응급 조치 필요성
4. 병원 방문 권장 여부
5. 예방 방법

주의: 이는 참고용 정보이며, 정확한 진단을 위해서는 반드시 수의사 진료를 받으시기 바랍니다.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: "당신은 수의사 관점에서 조언하는 전문가입니다. 참고용 정보임을 명시하며 한국어로 답변합니다." },
            { role: "user", content: prompt }
        ],
    });

    return response.choices[0].message.content || "증상 분석을 완료할 수 없습니다.";
}