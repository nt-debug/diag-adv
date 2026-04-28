// netlify/functions/subscribe.js
// Crée ou met à jour un contact Brevo avec prénom, email et score ADV

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let prenom, email, score;
  try {
    ({ prenom, email, score } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (!prenom || !email || score === undefined) {
    return { statusCode: 400, body: JSON.stringify({ error: "Champs manquants : prenom, email, score requis." }) };
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY manquante dans les variables d'environnement Netlify.");
    return { statusCode: 500, body: JSON.stringify({ error: "Configuration serveur manquante." }) };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: {
          PRENOM: prenom,
          // SCORE_ADV doit exister comme attribut personnalisé dans votre compte Brevo
          // Créez-le via : Contacts > Attributs > Ajouter un attribut > Nombre
          SCORE_ADV: score,
        },
        updateEnabled: true, // met à jour le contact s'il existe déjà
      }),
    });

    // Brevo renvoie 201 (créé) ou 204 (mis à jour)
    if (response.status === 201 || response.status === 204) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true }),
      };
    }

    const errorData = await response.json();
    console.error("Erreur Brevo :", errorData);
    return {
      statusCode: response.status,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: errorData.message || "Erreur Brevo" }),
    };
  } catch (err) {
    console.error("Erreur réseau :", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Erreur réseau lors de l'appel Brevo." }),
    };
  }
};
