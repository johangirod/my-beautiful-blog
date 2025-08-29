// Script d'initialisation de la base de données avec des tables et des données de test
import { connectToDB } from "./connect-db.js";

import { runInitialization } from "./database-migration/2025-init.js";
import { migratePasswords } from "./database-migration/20250929-migrate-password.js";

async function initializeDatabase() {
  await runInitialization();
  await migratePasswords();

  let client;
  try {
    client = await connectToDB();
    console.log("Connecté à la base de données pour initialisation");

    // Vérifier si l'utilisateur admin existe déjà
    const userResult = await client.query(
      "SELECT * FROM users WHERE username = $1",
      ["admin"],
    );
    // Ajouter l'utilisateur admin s'il n'existe pas
    if (userResult.rows.length === 0) {
      await client.query(
        "INSERT INTO users (username, password) VALUES ($1, crypt($2, gen_salt('bf')))",
        ["admin", "admin123"],
      );
      console.log("Utilisateur admin créé");
    }
    // Ajouter des tags de test s'ils n'existent pas
    const tagTitles = ["JavaScript", "React", "NextJS", "TypeScript", "CSS"];
    for (const title of tagTitles) {
      const tagResult = await client.query(
        "SELECT * FROM tags WHERE title = $1",
        [title],
      );

      if (tagResult.rows.length === 0) {
        await client.query("INSERT INTO tags (title) VALUES ($1)", [title]);
        console.log(`Tag ${title} créé`);
      }
    }
    // Vérifier s'il y a des articles
    const postsResult = await client.query("SELECT COUNT(*) FROM posts");

    // Ajouter des articles de test s'il n'y en a pas
    if (parseInt(postsResult.rows[0].count) === 0) {
      // Articles de test
      const testPosts = [
        {
          title: "Article de test 15",
          content:
            "Ceci est le contenu de l'article de test numéro 15. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: "user1",
          tags: [1, 3], // JavaScript, NextJS
        },
        {
          title: "Article de test 18",
          content:
            "Ceci est le contenu de l'article de test numéro 18. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: "admin",
          tags: [2, 4], // React, TypeScript
        },
        {
          title: "Article de test 19",
          content:
            "Ceci est le contenu de l'article de test numéro 19. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: "user1",
          tags: [3, 5], // NextJS, CSS
        },
        {
          title: "Article de test 14",
          content:
            "Ceci est le contenu de l'article de test numéro 14. Il contient beaucoup de texte intéressant que personne ne lira jamais.",
          author: "admin",
          tags: [1, 2, 5], // JavaScript, React, CSS
        },
      ];

      for (const post of testPosts) {
        await client.query(
          "INSERT INTO posts (title, content, author, tags) VALUES ($1, $2, $3, $4)",
          [post.title, post.content, post.author, post.tags],
        );
        console.log(`Article "${post.title}" créé`);
      }
    }

    console.log("Initialisation de la base de données terminée avec succès");
    process.exit(0);
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error,
    );
    process.exit(1);
  }
}

initializeDatabase();
