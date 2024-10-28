// src/seeds/seed.ts
import { Sequelize } from 'sequelize-typescript';
import { seedUser } from './user.seed';
import { User } from '../modules/users/users.model';

async function runSeed() {
    // Initialiser Sequelize avec les mêmes configurations que dans app.module.ts
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [User], // Charger le modèle User dans cette instance
        logging: console.log, // Optionnel : pour afficher les logs de la requête
    });

    try {
        // Synchroniser le modèle avec la base de données (à éviter en production)
        await sequelize.sync();

        // Exécuter la fonction de seeding
        await seedUser();

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Fermer la connexion Sequelize
        await sequelize.close();
    }
}