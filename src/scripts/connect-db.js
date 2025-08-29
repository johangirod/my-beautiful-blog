import { Client } from "pg";

const isProduction = process.env.NODE_ENV === "production";

const client = isProduction
  ? new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Nécessaire pour la connexion SSL à Neon
    })
  : new Client({
      host: "localhost",
      port: 5432,
      database: "blog",
      user: "postgres",
      password: "postgres",
    });

let db;

// Fonction pour initialiser la connexion à la base de données
export async function connectToDB() {
  if (!db) {
    await client.connect();
    console.log(
      `Connecté à la base de données en mode ${isProduction ? "production" : "développement"}`,
    );
    db = client;
  }
  return db;
}
