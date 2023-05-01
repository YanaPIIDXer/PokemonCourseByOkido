require("dotenv").config();

import { PokemonClient } from "pokenode-ts";

/**
 * Entry Point
 */
const main = async (): Promise<void> => {
  const client = new PokemonClient();
  const result = await client.getPokemonById(1);
  console.log(result.name);
};

// Start Program
main();
