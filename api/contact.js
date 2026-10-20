const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body))
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_RECEIVING_EMAIL || !process.env.RESEND_FROM_EMAIL) {
    return sendJson(response, 500, { error: 'Email service is not configured.' })
  }

  let payload
  try {
    payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body
  } catch {
    return sendJson(response, 400, { error: 'Invalid request body.' })
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return sendJson(response, 400, { error: 'Invalid request body.' })
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : ''
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''
  const website = typeof payload.website === 'string' ? payload.website.trim() : ''

  if (website) return sendJson(response, 200, { ok: true })
  if (!name || !email || !message) return sendJson(response, 400, { error: 'Name, email, and message are required.' })
  if (!emailPattern.test(email)) return sendJson(response, 400, { error: 'Please provide a valid email address.' })

  const emailSubject = subject || 'New Contact Form Submission'
  const emailText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${emailSubject}`,
    `Message: ${message}`,
  ].join('\n\n')

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.CONTACT_RECEIVING_EMAIL],
        reply_to: email,
        subject: emailSubject,
        text: emailText,
      }),
    })

    if (!resendResponse.ok) return sendJson(response, 502, { error: 'Email delivery failed.' })
    return sendJson(response, 200, { ok: true })
  } catch {
    return sendJson(response, 502, { error: 'Email delivery failed.' })
  }
}
