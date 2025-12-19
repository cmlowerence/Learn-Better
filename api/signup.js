const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, passkey } = request.body;

  if (!username || !passkey) {
    return response.status(400).json({ error: 'Username and passkey are required' });
  }

  if (passkey.length < 6) {
    return response.status(400).json({ error: 'Passkey must be at least 6 characters' });
  }

  try {
    // 1. Check if user already exists
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (rows.length > 0) {
      return response.status(409).json({ error: 'Username already taken' });
    }

    // 2. Hash the password (Security Best Practice)
    const hashedPassword = await bcrypt.hash(passkey, 10);

    // 3. Insert new user
    await sql`
      INSERT INTO users (username, password, role, quiz_history, quiz_progress)
      VALUES (${username}, ${hashedPassword}, 'student', '[]', '[]')
    `;

    return response.status(201).json({ success: true, message: 'Account created successfully' });

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
