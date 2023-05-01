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
  const llm = new OpenAI({
    modelName: "gpt-3.5-turbo",
  });

  const systemTemplate = fs.readFileSync("./templates/System.txt").toString();
  const descriptionTemplate = fs.readFileSync("./templates/Description.txt").toString();

  const template = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    HumanMessagePromptTemplate.fromTemplate(descriptionTemplate),
  ]);

  const chain = new ConversationChain({
    llm,
    prompt: template,
  });

  const response = await chain.call({ pokemon: name });
  let result = response.response;

  return result;
}
