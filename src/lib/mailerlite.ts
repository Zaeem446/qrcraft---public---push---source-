const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${MAILERLITE_API_KEY}`,
};

export async function addSubscriberToMailerLite(
  email: string,
  firstName: string
) {
  if (!MAILERLITE_API_KEY) {
    console.warn('MailerLite not configured, skipping subscriber sync');
    return;
  }

  const body: Record<string, unknown> = {
    email,
    fields: { name: firstName },
  };

  // Add to specific group if configured
  if (MAILERLITE_GROUP_ID) {
    body.groups = [MAILERLITE_GROUP_ID];
  }

  const response = await fetch(
    'https://connect.mailerlite.com/api/subscribers',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('MailerLite API error:', errorText);
  }
}

export async function removeSubscriberFromMailerLite(email: string) {
  if (!MAILERLITE_API_KEY) {
    console.warn('MailerLite not configured, skipping unsubscribe');
    return;
  }

  // First get subscriber ID by email
  const searchRes = await fetch(
    `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
    { headers }
  );

  if (!searchRes.ok) {
    console.error('MailerLite subscriber lookup failed:', await searchRes.text());
    return;
  }

  const { data } = await searchRes.json();
  if (!data?.id) return;

  // Update subscriber status to unsubscribed
  const response = await fetch(
    `https://connect.mailerlite.com/api/subscribers/${data.id}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status: 'unsubscribed' }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('MailerLite unsubscribe error:', errorText);
  }
}
