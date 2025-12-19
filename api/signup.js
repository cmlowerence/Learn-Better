import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  // 1. Handle CORS (Optional but good for safety)
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
    return response.status(400).json({ error: 'Missing credentials' });
  }

  try {
    // 2. Database Logic
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (rows.length > 0) {
      return response.status(409).json({ error: 'Username taken' });
    }

    const hashedPassword = await bcrypt.hash(passkey, 10);

    await sql`
      INSERT INTO users (username, password, role, quiz_history, quiz_progress)
      VALUES (${username}, ${hashedPassword}, 'student', '[]', '[]')
    `;

    return response.status(201).json({ success: true });
  } catch (error) {
    console.error('Signup Error:', error); // This puts the error in Vercel Logs
    return response.status(500).json({ error: error.message });
  }
}
