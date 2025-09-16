import pg from 'pg';

function getPgConfig(dbName) {
	return {
		host: process.env.POSTGRES_HOST ?? 'localhost',
		port: Number(process.env.POSTGRES_PORT) || 5432,
		user: process.env.POSTGRES_USER ?? 'postgres',
		password: process.env.POSTGRES_PASSWORD ?? 'postgres',
		database: dbName,
	};
}

export async function ensureContactMessagesPhoneColumn() {
	const targetDb = process.env.POSTGRES_DB ?? 'svi_db';
	const client = new pg.Client(getPgConfig(targetDb));
	await client.connect();
	try {
		// Ensure table exists first
		const tableRes = await client.query(
			`SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='contact_messages'`
		);
		if (tableRes.rowCount === 0) return;

		const existsRes = await client.query(
			`SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='contact_messages' AND column_name='phone'`
		);
		if (existsRes.rowCount === 0) {
			await client.query(`ALTER TABLE public.contact_messages ADD COLUMN phone varchar(24) NOT NULL DEFAULT ''`);
			if (process.env.SQL_LOG === 'true') {
				console.log('Added column contact_messages.phone');
			}
		}
	} finally {
		await client.end();
	}
}


