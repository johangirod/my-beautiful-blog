// Script pour initialiser la base de données

import { connectToDB } from "../connect-db.js";

export async function runInitialization() {
  console.log("Démarrage de l'initialisation de la base de données...");
  try {
    const client = await connectToDB();
    // Créer la table users si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      )
    `);

    // Créer la table tags si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Créer la table posts si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags INTEGER[] DEFAULT '{}'
      )
    `);
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    throw error;
  }
}
