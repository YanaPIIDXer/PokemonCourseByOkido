import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { constructLineApi } from "./line";
import { translateNameEngToJap, fetchOkido } from "./Functions";
import type { WebhookEvent, MessageEvent, TextMessage } from "@line/bot-sdk";
import { PokemonClient } from "pokenode-ts";

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
  
  // ポケモンの情報を取得
  const pokemonclient = new PokemonClient();

  const body = JSON.parse(event.body);
  const promises = (body.events as WebhookEvent[]).map(async ev => {
    if (ev.type !== "message") { return; }

    const msgEv = ev as MessageEvent;
    if (msgEv.message.type !== "text" || !msgEv.source.userId) { return; }
    const msg = msgEv.message as TextMessage;
    const pokemonId = Number(msg.text) || 1;
    const pokemon = await pokemonclient.getPokemonById(pokemonId);
    const japName = await translateNameEngToJap(pokemon.name);
    const result = await fetchOkido(japName);
    
    console.log(result);
  });

  await Promise.all(promises);
  
  return {
    statusCode: 200,
    body: "OK",
  }
}
