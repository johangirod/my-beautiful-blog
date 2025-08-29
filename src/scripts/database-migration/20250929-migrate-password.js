import { connectToDB } from "../connect-db.js";

export async function migratePasswords() {
  const client = await connectToDB();

  try {
    console.log(
      "Connecté à la base de données pour migration des mots de passe",
    );

    // 1. Test if password are encrypted
    const { rows } = await client.query(
      "SELECT * FROM pg_extension WHERE extname = 'pgcrypto'",
    );
    const isEncrypted = !!rows[0];

    if (isEncrypted) {
      console.log("Mots de passe cryptés, pas de migration nécessaire");

      return;
    }
    await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    await client.query(
      "UPDATE users SET password = crypt(password, gen_salt('bf'))",
    );
  } catch (error) {
    console.error("Erreur lors de la migration des mots de passe:", error);
    throw error;
  }
}
