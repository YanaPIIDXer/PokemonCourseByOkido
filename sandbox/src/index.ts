require("dotenv").config();

import { PokemonClient } from "pokenode-ts";
import { translateNameEngToJap } from "./Functions";

/**
 * 実行
 * @param pokemonId ポケモンのID
 */
const exec = async (pokemonId: number): Promise<void> => {
  try {
    // ポケモンの情報を取得
    const client = new PokemonClient();
    const pokemon = await client.getPokemonById(pokemonId);

    const japName = await translateNameEngToJap(pokemon.name);
    console.log(japName);
  } catch (error: any) {
    console.error(error.message ?? error);
  }
};

/**
 * Entry Point
 */
const main = async (): Promise<void> => {
  exec(3);
};

// Start Program
main();
