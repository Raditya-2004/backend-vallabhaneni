import { Router } from 'express';
import { sequelize } from '../lib/sequelize.js';

const router = Router();

router.get('/', async (_req, res) => {
	try {
		await sequelize.authenticate();
		res.json({ status: 'ok', db: 'connected' });
	} catch (err) {
		res.status(500).json({ status: 'error', db: 'disconnected' });
	}
});

export default router;


