import pg from 'pg';

export async function ensureDatabase() {
	const targetDb = process.env.POSTGRES_DB ?? 'svi_db';
	const host = process.env.POSTGRES_HOST ?? 'localhost';
	const port = Number(process.env.POSTGRES_PORT) || 5432;
	const user = process.env.POSTGRES_USER ?? 'postgres';
	const password = process.env.POSTGRES_PASSWORD ?? 'postgres';
	const maintenanceDb = process.env.POSTGRES_MAINTENANCE_DB ?? 'postgres';

	const client = new pg.Client({ host, port, user, password, database: maintenanceDb });
	await client.connect();
	try {
		const { rows } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
		if (rows.length === 0) {
			await client.query(`CREATE DATABASE "${targetDb}"`);
			if (process.env.SQL_LOG === 'true') {
				console.log(`Created database ${targetDb}`);
			}
		}
	} finally {
		await client.end();
	}
}


