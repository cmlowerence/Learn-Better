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

  try {
    // 1. Fetch user
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = rows[0];

    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    // 2. Check Password (supports both plain text legacy and new hashed)
    let isMatch = false;
    if (user.password.startsWith('$2a$')) {
        // It's a hashed password
        isMatch = await bcrypt.compare(passkey, user.password);
    } else {
        // It's a legacy plain text password
        isMatch = (passkey === user.password);
    }

    if (!isMatch) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Auto-Migrate Legacy Passwords to Hash (Security Upgrade)
    if (!user.password.startsWith('$2a$')) {
        const newHash = await bcrypt.hash(passkey, 10);
        await sql`UPDATE users SET password = ${newHash} WHERE id = ${user.id}`;
    }

    return response.status(200).json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        quiz_history: user.quiz_history || [],
        quiz_progress: user.quiz_progress || [],
        mistakes: user.mistakes || []
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return response.status(500).json({ error: error.message });
  }
};
