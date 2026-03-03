import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const bedrock = new BedrockRuntimeClient({});

const MODEL_ID = "eu.anthropic.claude-haiku-4-5-20251001-v1:0";
const TABLE_NAME = process.env.TABLE_NAME!;

async function invokeModel(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  maxTokens: number = 256
): Promise<string> {
  const response = await bedrock.send(
    new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    })
  );
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0]?.text ?? "";
}

async function invokeModelStream(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  maxTokens: number = 1024
): Promise<string> {
  const response = await bedrock.send(
    new InvokeModelWithResponseStreamCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    })
  );
  let fullText = "";
  for await (const event of response.body!) {
    if (event.chunk) {
      const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
      if (chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") {
        fullText += chunk.delta.text;
      }
    }
  }
  return fullText;
}

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const streamHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  "Transfer-Encoding": "chunked",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface APIGatewayEvent {
  routeKey: string;
  body?: string;
  pathParameters?: Record<string, string>;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export async function handler(event: APIGatewayEvent) {
  try {
    switch (event.routeKey) {
      case "GET /todos":
        return await getTodos();
      case "POST /todos":
        return await createTodo(JSON.parse(event.body || "{}"));
      case "PUT /todos/{id}":
        return await updateTodo(
          event.pathParameters!.id,
          JSON.parse(event.body || "{}")
        );
      case "DELETE /todos/{id}":
        return await deleteTodo(event.pathParameters!.id);
      case "POST /chat":
        return await chat(JSON.parse(event.body || "{}"));
      case "POST /categorize":
        return await categorize(JSON.parse(event.body || "{}"));
      case "POST /suggest":
        return await suggest(JSON.parse(event.body || "{}"));
      case "OPTIONS /todos":
      case "OPTIONS /todos/{id}":
      case "OPTIONS /chat":
      case "OPTIONS /categorize":
      case "OPTIONS /suggest":
        return { statusCode: 200, headers, body: "" };
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Not found" }),
        };
    }
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

async function getTodos() {
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME })
  );

  const todos = (result.Items || []).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(todos),
  };
}

async function createTodo(body: { text: string }) {
  const todo = {
    id: crypto.randomUUID(),
    text: body.text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({ TableName: TABLE_NAME, Item: todo })
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(todo),
  };
}

async function updateTodo(
  id: string,
  body: { completed?: boolean; category?: string; priority?: string }
) {
  const expressions: string[] = [];
  const values: Record<string, unknown> = {};

  if (body.completed !== undefined) {
    expressions.push("completed = :completed");
    values[":completed"] = body.completed;
  }
  if (body.category !== undefined) {
    expressions.push("category = :category");
    values[":category"] = body.category;
  }
  if (body.priority !== undefined) {
    expressions.push("priority = :priority");
    values[":priority"] = body.priority;
  }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    })
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Attributes),
  };
}

async function deleteTodo(id: string) {
  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
  );

  return {
    statusCode: 204,
    headers,
    body: "",
  };
}

function buildSystemPrompt(todos: Todo[]): string {
  const taskList = todos
    .map((t) => `- [${t.completed ? "x" : " "}] ${t.text}`)
    .join("\n");

  return `You are a helpful assistant in TaskFlow, a task management app.
The user's current tasks:
${taskList || "(No tasks yet)"}

Help them manage tasks, suggest improvements, and be concise.`;
}

async function chat(body: { messages: ChatMessage[]; todos: Todo[] }) {
  const systemPrompt = buildSystemPrompt(body.todos || []);

  const fullText = await invokeModelStream(
    systemPrompt,
    body.messages.map((m) => ({ role: m.role, content: m.content }))
  );

  return {
    statusCode: 200,
    headers: streamHeaders,
    body: fullText,
  };
}

async function categorize(body: { text: string }) {
  const text = await invokeModel(
    'Respond with ONLY valid JSON. Format: {"category": "<category>", "priority": "<priority>"}. ' +
      "Categories: work, personal, shopping, health, learning, other. " +
      "Priorities: high, medium, low.",
    [{ role: "user", content: `Categorize this task: "${body.text}"` }]
  );

  try {
    const cleaned = text.replace(/```(?:json)?\s*/g, "").trim();
    const { category, priority } = JSON.parse(cleaned);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ category, priority }),
    };
  } catch {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ category: "other", priority: "medium" }),
    };
  }
}

async function suggest(body: { todos: Todo[] }) {
  const currentTasks = (body.todos || [])
    .map((t) => `- ${t.text}`)
    .join("\n");

  const userMessage = currentTasks
    ? `My current tasks:\n${currentTasks}\n\nSuggest 3 new tasks.`
    : "I have no tasks yet. Suggest 3 productive starter tasks.";

  const text = await invokeModel(
    "Respond with ONLY a JSON array of exactly 3 short task strings. " +
      'Example: ["Buy groceries", "Schedule dentist appointment", "Review project notes"]',
    [{ role: "user", content: userMessage }],
    512
  );

  try {
    const cleaned = text.replace(/```(?:json)?\s*/g, "").trim();
    const suggestions = JSON.parse(cleaned);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ suggestions }),
    };
  } catch {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ suggestions: [] }),
    };
  }
}
