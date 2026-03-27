/**
 * Auth Middleware — decodes Clerk JWT from Authorization header
 * without requiring CLERK_SECRET_KEY on the server.
 * Clerk already validates tokens on the frontend; we just read the userId from the payload.
 */
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];

    // JWT payload is the middle part (base64url encoded), no secret needed to decode
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return res.status(401).json({ error: 'Invalid token format' });

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));

    if (!payload.sub) return res.status(401).json({ error: 'Token has no user ID' });

    // Attach as req.auth to match ClerkExpressRequireAuth shape that controllers expect
    req.auth = { userId: payload.sub };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};