import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { sequelize } from './lib/sequelize.js';
import { ensureDatabase } from './lib/ensureDatabase.js';
import { ensureContactMessagesPhoneColumn } from './lib/ensureColumns.js';
import healthRouter from './routes/health.js';
import contactRouter from './routes/contact.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

app.use('/health', healthRouter);
app.use('/api/contact', contactRouter);

app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

const PORT = Number(process.env.PORT) || 4000;

async function start() {
	try {
		await ensureDatabase();
		await ensureContactMessagesPhoneColumn();
		await sequelize.authenticate();
		await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();


