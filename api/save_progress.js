const { sql } = require('@vercel/postgres');

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, history, progress } = request.body;

  try {
    await sql`
      UPDATE users 
      SET quiz_history = ${JSON.stringify(history)}, 
          quiz_progress = ${JSON.stringify(progress)}
      WHERE username = ${username}
    `;
    return response.status(200).json({ success: true });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
