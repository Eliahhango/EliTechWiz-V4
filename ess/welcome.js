// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
const s = require("../set");

// Récupérez l'URL de la base de données de la variable s.DATABASE_URL
var dbUrl=s.DATABASE_URL?s.DATABASE_URL:"postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9"
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);

// Vous pouvez maintenant utiliser 'pool' pour interagir avec votre base de données PostgreSQL.
const creerTableevents = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        Id serial PRIMARY KEY,
        jid text UNIQUE,
        welcome text DEFAULT 'non',
        goodbye text DEFAULT 'non',
        antipromote text DEFAULT 'non',
        antidemote text DEFAULT 'non'
      );
    `);
    console.log("La table 'events' a été créée avec succès.");
  } catch (e) {
    console.error("Une erreur est survenue lors de la création de la table 'events':", e);
  }
};

// Appelez la méthode pour créer la table "banUser"
creerTableevents();

// Fonction pour ajouter un utilisateur à la liste des bannis
async function mettreAJour(jid, row, valeur) {
  const client = await pool.connect();
  
  try {
    // Validate that the column name is legitimate to prevent SQL injection
    const validColumns = ['welcome', 'goodbye', 'promote', 'demote']; // List all valid column names
    if (!validColumns.includes(row)) {
      throw new Error(`Invalid column name: ${row}`);
    }

    // Check if the JID already exists in the table
    const result = await client.query('SELECT * FROM events WHERE jid = $1', [jid]);
    const jidExiste = result.rows.length > 0;

    if (jidExiste) {
      // Use a parameterized query with a template string for the column name
      // This is safe because we validated the column name above
      await client.query(`UPDATE events SET ${row} = $1 WHERE jid = $2`, [valeur, jid]);
    } else {
      // Use a parameterized query with a template string for the column name
      await client.query(`INSERT INTO events (jid, ${row}) VALUES ($1, $2)`, [jid, valeur]);
    }
    
    console.log(`JID ${jid} mis à jour avec succès dans la table 'events'.`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du JID dans la table events:', error);
    return false;
  } finally {
    client.release();
  }
}

async function obtenirValeur(jid, row) {
  const client = await pool.connect();

  try {
    // Validate that the column name is legitimate to prevent SQL injection
    const validColumns = ['welcome', 'goodbye', 'promote', 'demote']; // List all valid column names
    if (!validColumns.includes(row)) {
      throw new Error(`Invalid column name: ${row}`);
    }

    // Use a parameterized query with a template string for the column name
    const result = await client.query(`SELECT ${row} FROM events WHERE jid = $1`, [jid]);
    
    if (result.rows.length > 0) {
      return result.rows[0][row];
    } else {
      // If the JID doesn't exist in the table, return null or a default value
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la valeur dans la table events:', error);
    return null;
  } finally {
    client.release();
  }
}

module.exports = {
  mettreAJour,
  obtenirValeur,
};
