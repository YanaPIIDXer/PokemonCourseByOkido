import type { ILineApi } from "./LineApiInterface";
import { ApiMock } from "./ApiMock";
import { LineApi } from "./LineApi";

// 環境に合わせてモックと実際のオブジェクトを入れ替える
export const constructLineApi = () => {
  const isExecLocal = process.env.EXEC_LOCAL?.toLowerCase() === "true";
  const lineApi: ILineApi = isExecLocal ? new ApiMock() : new LineApi();
  return lineApi;
}
