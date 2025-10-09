import OpenAI from "openai";
import { z } from "zod";
import env from "../config/env.js";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatJsonOptions<T> {
  readonly messages: ChatMessage[];
  readonly schema: z.ZodType<T>;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly functionName?: string;
}

export interface ChatJsonResult<T> {
  readonly data?: T;
  readonly rawText?: string;
  readonly error?: unknown;
  readonly source: "AI" | "STATIC";
}

let client: OpenAI | undefined;

const getClient = (): OpenAI | undefined => {
  if (!env.openAiApiKey) {
    return undefined;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: env.openAiApiKey,
    });
  }

  return client;
};

const parseJson = <T>(text: string, schema: z.ZodType<T>): T => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Failed to parse OpenAI JSON response: ${(error as Error).message}`,
    );
  }

  const result = schema.safeParse(parsed);

  if (!result.success) {
    throw new Error(
      `OpenAI response did not match schema: ${result.error.message}`,
    );
  }

  return result.data;
};

export const chatCompletionJson = async <T>({
  messages,
  schema,
  model,
  temperature,
  maxTokens,
  functionName,
}: ChatJsonOptions<T>): Promise<ChatJsonResult<T>> => {
  const openAi = getClient();

  if (!openAi) {
    return {
      source: "STATIC",
      error: new Error("OpenAI API key is not configured"),
    };
  }

  try {
    const response = await openAi.chat.completions.create({
      model: model ?? env.model,
      temperature: temperature ?? 0,
      max_tokens: maxTokens,
      messages: [
        ...messages,
        functionName
          ? {
              role: "system",
              content: `Only respond with valid JSON for the ${functionName} function schema.`,
            }
          : undefined,
      ].filter((message): message is ChatMessage => Boolean(message)),
      response_format: {
        type: "json_object",
      },
    });

    const rawText = response.choices[0]?.message?.content ?? "";

    if (!rawText) {
      throw new Error("OpenAI returned an empty response");
    }

    const data = parseJson(rawText, schema);

    return {
      data,
      rawText,
      source: "AI",
    };
  } catch (error) {
    console.error("OpenAI chat completion failed", error);
    return {
      error,
      source: "STATIC",
    };
  }
};
