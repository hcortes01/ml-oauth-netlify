export async function handler(event) {
  try {
    const body = event.body;

    const response = await fetch("https://api.mercadolibre.com/pictures", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ML_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "MercadoLibre-API-Example"
      },
      body
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
