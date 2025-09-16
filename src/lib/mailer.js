import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.MAIL_FROM || smtpUser;
const adminEmail = process.env.MAIL_TO_ADMIN;

let transporter;

export function getTransporter() {
	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: smtpHost,
			port: smtpPort,
			secure: smtpPort === 465,
			auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
		});
	}
	return transporter;
}

export async function sendAdminNotification({ name, email, phone, message, id }) {
	if (!adminEmail) return;
	const t = getTransporter();
	const subject = `New contact request (#${id}) from ${name}`;
	const text = `New contact message received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}\n\nID: ${id}`;
	await t.sendMail({ from: fromEmail, to: adminEmail, subject, text });
}

export async function sendUserConfirmation({ name, email, id }) {
	if (!email) return;
	const t = getTransporter();
	const subject = `We received your request (#${id})`;
	const text = `Hi ${name},\n\nThank you for contacting Sri Vallabhaneni Industries. Your request has been received. Our team will get back to you shortly.\n\nThanks & Regards,\nSRI VALLABHANENI INDUSTRIES\nOPP. St. JOSEPH'S SCHOOL,\nKHAMMAM CROSS ROAD,\nKODAD - 508206\nSURYAPET (Dt.)\nTELANGANA - INDIA\nMobile Number: +91 9121524564, 9573934959, 9848552899`;
	await t.sendMail({ from: fromEmail, to: email, subject, text });
}


