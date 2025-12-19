import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, passkey } = request.body;

  try {
    // 1. Fetch user from DB
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = rows[0];

    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    // 2. Check Password
    // We check if it matches the plain text (old way) OR the hash (new way)
    const isMatch = (passkey === user.password) || await bcrypt.compare(passkey, user.password);

    if (!isMatch) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. If password was plain text, let's secure it now (Auto-migration)
    if (passkey === user.password && !user.password.startsWith('$2a$')) {
      const newHash = await bcrypt.hash(passkey, 10);
      await sql`UPDATE users SET password = ${newHash} WHERE id = ${user.id}`;
    }

    // 4. Return success + data
    return response.status(200).json({ 
      success: true, 
      user: {
        username: user.username,
        role: user.role,
        quiz_history: user.quiz_history || [],
        quiz_progress: user.quiz_progress || []
      }
    });

  } catch (error) {
    return response.status(500).json({ error:
