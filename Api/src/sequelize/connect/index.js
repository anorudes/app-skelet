import Sequelize from 'sequelize';
import { PG_DB_DATA } from '../../../config/main';

// Connect to PostgreSQL
export const sequelize = new Sequelize(
  PG_DB_DATA.db,
  PG_DB_DATA.user,
  PG_DB_DATA.passwd,
  PG_DB_DATA.options,
);

