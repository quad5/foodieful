import { config } from 'dotenv';
config();


module.exports = {
    hostUrl: process.env.URL,
    pgsqlDatabase: process.env.PGSQL_DATABASE,
    pgsqlHost: process.env.PGSQL_HOST,
    pgsqlPassword: process.env.PGSQL_PASSWORD,
    pgsqlPort: process.env.PGSQL_PORT,
    pgsqlUser: process.env.PGSQL_USER,
};

