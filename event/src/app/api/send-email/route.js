'use server';

import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body || {};

    if (!to || !subject || (!text && !html)) {
      return new Response(JSON.stringify({ message: 'Missing required fields: to, subject, text/html' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });

    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ message: 'Email sent', id: info.messageId }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to send email', error: err?.message || String(err) }), { status: 500 });
  }
}


