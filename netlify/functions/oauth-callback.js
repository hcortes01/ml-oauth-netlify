exports.handler = async (event, context) => {
  try {
    console.log('*** oauth-callback invoked ***', { ts: new Date().toISOString() });

    const params = event.queryStringParameters || {};
    console.log('query params:', params);

    const code = params.code;
    if (!code) {
      console.log('Missing code -> returning 400');
      return { statusCode: 400, body: 'Missing code' };
    }

    const CLIENT_ID = process.env.ML_CLIENT_ID;
    const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
    const REDIRECT_URI = process.env.ML_REDIRECT_URI;

    console.log('env check', {
      hasClientId: !!CLIENT_ID,
      hasClientSecret: !!CLIENT_SECRET,
      redirectUri: REDIRECT_URI
    });

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI
    }).toString();

    console.log('Request body preview:', body);

    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    console.log('tokenRes.status:', tokenRes.status);
    const tokenJson = await tokenRes.json();
    console.log('tokenJson:', tokenJson);

    return {
      statusCode: tokenRes.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokenJson, null, 2)
    };

  } catch (err) {
    console.error('Function error', err);
    return { statusCode: 500, body: String(err) };
  }
};

