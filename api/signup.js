const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

module.exports = async function handler(request, response) {
  // Handle CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, passkey } = request.body;

  if (!username || !passkey) {
    return response.status(400).json({ error: 'Username and passkey are required' });
  }

  try {
    // 1. Check if user exists
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (rows.length > 0) {
      return response.status(409).json({ error: 'Username already taken' });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(passkey, 10);

    // 3. Insert User
    await sql`
      INSERT INTO users (username, password, role, quiz_history, quiz_progress)
      VALUES (${username}, ${hashedPassword}, 'student', '[]', '[]')
    `;

    return response.status(201).json({ success: true, message: 'Account created' });
  } catch (error) {
    console.error('Signup Error:', error);
    return response.status(500).json({ error: error.message });
  }
};
