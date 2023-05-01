import { OpenAI } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate } from "langchain/prompts"
import * as fs from "fs";

/**
 * 英語表記の名前から日本語表記の名前に変換
 * @param engName 英語表記の名前
 */
export const translateNameEngToJap = async (engName: string): Promise<string> => {
  const llm = new OpenAI({
    modelName: "gpt-3.5-turbo",
  });
  
  const templateText = fs.readFileSync("./templates/Translate.txt").toString();
  const template = new PromptTemplate({
    inputVariables: ["pokemon"],
    template: templateText,
  });
  const chain = new ConversationChain({
    llm,
    prompt: template,
  });

  const response = await chain.call({ pokemon: engName });
  return response.response;
};

/**
 * ポケモン講座、開講
 * @param name ポケモンの名前（日本語表記）
 */
export const fetchOkido = async (name: string): Promise<string> => {
  const description = await fetchConversation("./templates/Description.txt", name);
  const punchLine = await fetchConversation("./templates/PunchLine.txt", name);
  const end = await fetchConversation("./templates/End.txt", name);
  return description + "\n\n" + punchLine + "\n\n\n" + "ではここで一句。\n" + end;
}

/**
 * 会話
 * @param humanPromptTemplatePath HumanMessagePromptTemplateに渡すプロンプト
 * @param pokemonName ポケモンの名前
 */
const fetchConversation = async (humanPromptTemplatePath: string, pokemonName: string): Promise<string> => {
  const llm = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.5,
  });

  const systemTemplate = fs.readFileSync("./templates/System.txt").toString();
  const humanTemplate = fs.readFileSync(humanPromptTemplatePath).toString();

  const template = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    HumanMessagePromptTemplate.fromTemplate(humanTemplate),
  ]);

  const chain = new ConversationChain({
    llm,
    prompt: template,
  });

  const response = await chain.call({ pokemon: pokemonName });
  return response.response;
}
