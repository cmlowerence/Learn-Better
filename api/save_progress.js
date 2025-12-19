const { sql } = require('@vercel/postgres');

module.exports = async function handler(request, response) {
  // Handle CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method Not Allowed' });

  // We now accept 'mistakes' in the body
  const { username, history, progress, mistakes } = request.body;

  try {
    // We update only the fields that are provided. 
    // This allows us to sync just mistakes, or just history, or both.
    
    // Dynamic Query Construction
    if (history && progress && mistakes) {
       await sql`
        UPDATE users 
        SET quiz_history = ${JSON.stringify(history)}, 
            quiz_progress = ${JSON.stringify(progress)},
            mistakes = ${JSON.stringify(mistakes)}
        WHERE username = ${username}
      `;
    } else if (mistakes) {
       // Special case: Only updating mistakes
       await sql`UPDATE users SET mistakes = ${JSON.stringify(mistakes)} WHERE username = ${username}`;
    } else {
       // Fallback: Updating just progress (old behavior)
       await sql`
        UPDATE users 
        SET quiz_history = ${JSON.stringify(history)}, 
            quiz_progress = ${JSON.stringify(progress)}
        WHERE username = ${username}
      `;
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Save Error:', error);
    return response.status(500).json({ error: error.message });
  }
};
