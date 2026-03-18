import 'dotenv/config';
import { Sequelize } from 'sequelize';

const isProduction=process.env.NODE_ENV==='production'

export const sequelize = process.env.DATABASE_URL? new Sequelize (
  process.env.DATABASE_URL,{
    dialect:"postgres",
    logging:false,
    dialectOptions:isProduction?{
      ssl:{
        require:true,
        rejectUnauthorized:false
      }
    }:{}
  }
)
: new Sequelize(
  process.env.DB_NAME || 'todo',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);
