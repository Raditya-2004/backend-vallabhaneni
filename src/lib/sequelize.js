import { Sequelize } from 'sequelize';

const dbName = process.env.POSTGRES_DB ?? 'svi_db';
const dbUser = process.env.POSTGRES_USER ?? 'postgres';
const dbPass = process.env.POSTGRES_PASSWORD ?? 'postgres';
const dbHost = process.env.POSTGRES_HOST ?? 'localhost';
const dbPort = Number(process.env.POSTGRES_PORT) || 5432;

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
	host: dbHost,
	port: dbPort,
	dialect: 'postgres',
	logging: process.env.SQL_LOG === 'true' ? console.log : false,
});


