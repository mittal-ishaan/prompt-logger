// import { Sequelize } from 'sequelize-typescript';
// import { Logger } from '@nestjs/common';

// import { isProductionEnv } from '../utils/utils';
// import { UserModel } from './models';
// import { USER_DAO } from 'src/constants';

// export const databaseProviders = [
//   {
//     provide: 'SEQUELIZE',
//     useFactory: async () => {
//       const dbName = process.env.DB_NAME as string;
//       const dbUser = process.env.DB_USERNAME as string;
//       const dbHost = process.env.DB_HOST;
//       const dbDriver = 'postgres';
//       const dbPassword = process.env.DB_PASSWORD as string;
//       const dbPort = Number(process.env.DB_PORT);
//       const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//         host: dbHost,
//         dialect: dbDriver,
//         port: dbPort,
//         logging: isProductionEnv() ? false : (msg) => Logger.debug(msg),
//         pool: {
//           max: 5,
//           min: 1,
//           acquire: 30000,
//           idle: 10000,
//         },
//       });
//       sequelize.addModels([UserModel]);
//       return sequelize;
//     },
//   },
// ];

// export const spacesProviders = [
//   {
//     provide: USER_DAO,
//     useValue: UserModel,
//   },
// ];
