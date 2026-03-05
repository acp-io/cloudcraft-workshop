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

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface APIGatewayEvent {
  routeKey: string;
  body?: string;
  pathParameters?: Record<string, string>;
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
      case "POST /categorize":
        return await categorize(JSON.parse(event.body || "{}"));
      case "OPTIONS /todos":
      case "OPTIONS /todos/{id}":
      case "OPTIONS /categorize":
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

// TODO [Feature 2]: Implement updateTodo
//   - Use UpdateCommand to update the todo in DynamoDB
//   - Support updating: completed (boolean), category (string), priority (string)
//   - Build UpdateExpression dynamically from the fields present in the body
//   - Return the updated item (ReturnValues: "ALL_NEW")
async function updateTodo(
  id: string,
  body: { completed?: boolean; category?: string; priority?: string }
) {
  // Replace this stub with a real DynamoDB UpdateCommand
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({ error: "Not implemented — this is your task!" }),
  };
}

// TODO [Feature 1]: Implement deleteTodo
//   - Use DeleteCommand to remove the todo from DynamoDB by id
//   - Return 204 (no content) on success
async function deleteTodo(id: string) {
  // Replace this stub with a real DynamoDB DeleteCommand
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({ error: "Not implemented — this is your task!" }),
  };
}

// TODO [Feature 3]: Implement categorize
//   - Use the invokeModel() helper above to call Claude
//   - System prompt: ask for JSON with { category, priority }
//   - Categories: work, personal, shopping, health, learning, other
//   - Priorities: high, medium, low
//   - Parse the JSON response, return { category, priority }
//   - Fall back to { category: "other", priority: "medium" } if parsing fails
async function categorize(body: { text: string }) {
  // Replace this stub with a real Bedrock invocation using invokeModel()
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({ error: "Not implemented — this is your task!" }),
  };
}
