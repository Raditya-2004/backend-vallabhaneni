import { Router } from 'express';
import { z } from 'zod';
import { ContactMessage } from '../models/ContactMessage.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendAdminNotification, sendUserConfirmation } from '../lib/mailer.js';

const router = Router();

const contactSchema = z.object({
	name: z.string().min(2).max(120),
	email: z.string().email().max(160),
	phone: z.string().min(7).max(24),
	message: z.string().min(10),
});

router.post('/', async (req, res) => {
	const parse = contactSchema.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
	}

	try {
		const created = await ContactMessage.create(parse.data);
		Promise.resolve()
			.then(() => sendAdminNotification({ ...parse.data, id: created.id }))
			.then(() => (process.env.MAIL_SEND_USER === 'true' ? sendUserConfirmation({ ...parse.data, id: created.id }) : null))
			.catch(() => {});
		res.status(201).json({ id: created.id });
	} catch (err) {
		console.error('Failed to save contact message', err);
		res.status(500).json({ error: 'Failed to save message' });
	}
});

export default router;

// Admin: list messages with pagination
router.get('/', adminAuth, async (req, res) => {
	const page = Math.max(1, Number(req.query.page) || 1);
	const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
	const offset = (page - 1) * pageSize;

	try {
		const { rows, count } = await ContactMessage.findAndCountAll({
			order: [['created_at', 'DESC']],
			limit: pageSize,
			offset,
			attributes: ['id', 'name', 'email', 'message', 'created_at'],
		});
		res.json({ data: rows, page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) });
	} catch (err) {
		console.error('Failed to list contact messages', err);
		res.status(500).json({ error: 'Failed to list messages' });
	}
});


