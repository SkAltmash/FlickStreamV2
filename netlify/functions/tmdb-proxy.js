export async function handler(event) {
  const API_KEY = 'd1becbefc947f6d6af137051548adf7f';
  const baseUrl = 'https://api.themoviedb.org/3';

  const params = event.queryStringParameters || {};
  const endpoint = params.endpoint;

  if (!endpoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing endpoint parameter' }),
    };
  }

  const query = Object.entries(params)
    .filter(([key]) => key !== 'endpoint')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

const url = `${baseUrl}/${endpoint}?api_key=${API_KEY}${query ? '&' + query : ''}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('TMDB fetch error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'TMDB fetch failed', details: err.message }),
    };
  }
}
