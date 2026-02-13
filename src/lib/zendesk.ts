const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;

export async function createZendeskTicket(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  if (!ZENDESK_SUBDOMAIN || !ZENDESK_EMAIL || !ZENDESK_API_TOKEN) {
    throw new Error('Zendesk environment variables not configured');
  }

  const credentials = Buffer.from(
    `${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`
  ).toString('base64');

  const response = await fetch(
    `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        ticket: {
          subject,
          comment: {
            body: `Message from ${name} (${email}):\n\n${message}`,
          },
          requester: {
            name,
            email,
          },
          tags: ['contact-form', 'qrcraft-website'],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Zendesk API error:', errorText);
    throw new Error(`Zendesk API error: ${response.status}`);
  }

  return response.json();
}
