import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Region enforcement — workshop accounts are restricted to eu-central-2
// ---------------------------------------------------------------------------
const REQUIRED_REGION = "eu-central-2";
const config = new pulumi.Config("aws");
const region = config.require("region");
if (region !== REQUIRED_REGION) {
  throw new Error(
    `This workshop requires region ${REQUIRED_REGION}. ` +
    `Current region is "${region}". ` +
    `Run: pulumi config set aws:region ${REQUIRED_REGION}`
  );
}

// ---------------------------------------------------------------------------
// 1. DynamoDB Table — stores your to-do items
// ---------------------------------------------------------------------------

const todosTable = new aws.dynamodb.Table("taskflow-todos", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  billingMode: "PAY_PER_REQUEST",
});

// ---------------------------------------------------------------------------
// 2. IAM Role for Lambda — grants permission to access DynamoDB and Bedrock
// ---------------------------------------------------------------------------

const lambdaRole = new aws.iam.Role("taskflow-lambda-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: { Service: "lambda.amazonaws.com" },
        Effect: "Allow",
      },
    ],
  }),
});

new aws.iam.RolePolicyAttachment("lambda-basic-execution", {
  role: lambdaRole.name,
  policyArn:
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

new aws.iam.RolePolicy("lambda-dynamodb-policy", {
  role: lambdaRole.id,
  policy: todosTable.arn.apply((arn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: [
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: arn,
        },
      ],
    })
  ),
});

new aws.iam.RolePolicy("lambda-bedrock-policy", {
  role: lambdaRole.id,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
        Resource: "arn:aws:bedrock:*::inference-profile/eu.anthropic.claude-haiku-4-5-20251001-v1:0",
      },
    ],
  }),
});

// ---------------------------------------------------------------------------
// 3. Lambda Function — runs your API code serverlessly
// ---------------------------------------------------------------------------

const lambdaCodePath = path.resolve(__dirname, "../src/lambda/dist");

const lambdaFunction = new aws.lambda.Function("taskflow-api", {
  runtime: "nodejs20.x",
  handler: "handler.handler",
  role: lambdaRole.arn,
  code: new pulumi.asset.AssetArchive({
    ".": new pulumi.asset.FileArchive(lambdaCodePath),
  }),
  environment: {
    variables: {
      TABLE_NAME: todosTable.name,
    },
  },
  timeout: 30,
  memorySize: 256,
});

// ---------------------------------------------------------------------------
// 4. API Gateway — gives your Lambda a public URL
// ---------------------------------------------------------------------------

const api = new aws.apigatewayv2.Api("taskflow-api", {
  protocolType: "HTTP",
  corsConfiguration: {
    allowOrigins: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  },
});

const lambdaIntegration = new aws.apigatewayv2.Integration(
  "taskflow-lambda-integration",
  {
    apiId: api.id,
    integrationType: "AWS_PROXY",
    integrationUri: lambdaFunction.arn,
    payloadFormatVersion: "2.0",
  }
);

const routes = [
  { key: "GET /todos" },
  { key: "POST /todos" },
  { key: "PUT /todos/{id}" },
  { key: "DELETE /todos/{id}" },
  { key: "POST /categorize" },
];

for (const route of routes) {
  new aws.apigatewayv2.Route(`route-${route.key.replace(/[\s\/\{\}]/g, "-")}`, {
    apiId: api.id,
    routeKey: route.key,
    target: pulumi.interpolate`integrations/${lambdaIntegration.id}`,
  });
}

const stage = new aws.apigatewayv2.Stage("taskflow-api-stage", {
  apiId: api.id,
  name: "$default",
  autoDeploy: true,
});

new aws.lambda.Permission("api-lambda-permission", {
  action: "lambda:InvokeFunction",
  function: lambdaFunction.name,
  principal: "apigateway.amazonaws.com",
  sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
});

// ---------------------------------------------------------------------------
// 5. S3 Bucket — hosts your frontend files as a static website
// ---------------------------------------------------------------------------

const siteBucket = new aws.s3.BucketV2("taskflow-site");

new aws.s3.BucketWebsiteConfigurationV2("taskflow-site-website", {
  bucket: siteBucket.id,
  indexDocument: { suffix: "index.html" },
  errorDocument: { key: "index.html" },
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("taskflow-site-public-access", {
  bucket: siteBucket.id,
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
});

new aws.s3.BucketPolicy("taskflow-site-policy", {
  bucket: siteBucket.id,
  policy: siteBucket.arn.apply((bucketArn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `${bucketArn}/*`,
        },
      ],
    })
  ),
}, { dependsOn: [publicAccessBlock] });

const outDir = path.resolve(__dirname, "../out");

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".txt": "text/plain",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

function uploadDirectory(dirPath: string, prefix: string = "") {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      uploadDirectory(fullPath, key);
    } else {
      new aws.s3.BucketObjectv2(`site-${key.replace(/[\/\.]/g, "-")}`, {
        bucket: siteBucket.id,
        key: key,
        source: new pulumi.asset.FileAsset(fullPath),
        contentType: getMimeType(fullPath),
      });
    }
  }
}

uploadDirectory(outDir);

// ---------------------------------------------------------------------------
// 6. Outputs — your app URLs
// ---------------------------------------------------------------------------

export const siteUrl = pulumi.interpolate`http://${siteBucket.bucket}.s3-website.${REQUIRED_REGION}.amazonaws.com`;
export const apiEndpoint = api.apiEndpoint;
export const todosTableName = todosTable.name;
