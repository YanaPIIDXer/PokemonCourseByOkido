import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { constructLineApi } from "./line";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    console.error("Invalid request body.");
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request body.",
      }),
    }
  }
  
  // シグネチャ検証
  const lineApi = constructLineApi();
  const signature = event.headers["X-Line-Signature"];
  if (signature && !lineApi.verifySignature(event.body, signature)) {
    console.error("Verify signature failed.");
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Veryfy signature failed.",
      }),
    }
  }

  return {
    statusCode: 200,
    body: "OK",
  }
}
