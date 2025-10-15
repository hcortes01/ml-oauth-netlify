exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const code = params.code;
    if (!code) return { statusCode: 400, body: 'Missing code' };

    const CLIENT_ID = process.env.ML_CLIENT_ID;
    const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
    const REDIRECT_URI = process.env.ML_REDIRECT_URI;
    const MAKE_WEBHOOK = process.env.MAKE_WEBHOOK_URL || '';

    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) return { statusCode: tokenRes.status, body: JSON.stringify(tokenJson) };

    if (MAKE_WEBHOOK) {
      await fetch(MAKE_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'ml_oauth', data: tokenJson })
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h2>Autorización completada ✅</h2><p>Puedes cerrar esta ventana.</p></body></html>'
    };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
