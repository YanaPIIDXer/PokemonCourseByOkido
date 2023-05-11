import { OpenAI } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate } from "langchain/prompts"
import { template as translateTemplate } from "./templates/Translate";
import { template as systemTemplate } from "./templates/System";
import { template as descriptionTemplate } from "./templates/Description";
import { template as punchLineTemplate } from "./templates/PunchLine";
import { template as endTemplate } from "./templates/End";

/**
 * 英語表記の名前から日本語表記の名前に変換
 * @param engName 英語表記の名前
 */
export const translateNameEngToJap = async (engName: string): Promise<string> => {
  const llm = new OpenAI({
    modelName: "gpt-3.5-turbo",
  });
  
  const template = new PromptTemplate({
    inputVariables: ["pokemon"],
    template: translateTemplate,
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
  const description = await fetchConversation(descriptionTemplate, name);
  const punchLine = await fetchConversation(punchLineTemplate, name);
  const end = await fetchConversation(endTemplate, name);
  return description + "\n\n" + punchLine + "\n\n\n" + "ではここで一句。\n" + end;
}

/**
 * 会話
 * @param humanTemplate HumanMessagePromptTemplateに渡すプロンプトテンプレート
 * @param pokemonName ポケモンの名前
 */
const fetchConversation = async (humanTemplate: string, pokemonName: string): Promise<string> => {
  const llm = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.5,
  });

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
