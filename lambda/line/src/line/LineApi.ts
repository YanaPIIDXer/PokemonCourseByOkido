import type { ILineApi } from "./LineApiInterface";
import { Client, ClientConfig, validateSignature } from "@line/bot-sdk";

const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
const channelSecret = process.env.LINE_CHANNEL_SECRET!;

/**
 * LINEのAPIを実際に叩くクラス
 */
export class LineApi implements ILineApi {
  // LINE API Client
  private client: Client
  
  /**
   * コンストラクタ
   */
  constructor() {
    const config: ClientConfig = {
      channelAccessToken: accessToken,
      channelSecret: channelSecret,
    };
    this.client = new Client(config);
  }

  /**
   * シグネチャの検証
   * @param body レスポンスボディ
   * @param signature シグネチャ
   * @returns 検証が通ればtrue
   */
  verifySignature(body: string, signature: string): boolean {
    return validateSignature(body, channelSecret, signature);
  }

  /**
   * メッセージ送信
   * @param id ID
   * @param message メッセージ
   */
  async postMessage(id: string, message: string): Promise<void> {
    await this.client.pushMessage(id, { type: "text", text: message });
  }
}
