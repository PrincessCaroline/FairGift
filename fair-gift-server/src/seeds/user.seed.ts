import { User } from "../modules/users/users.model";


export async function seedUser() {
    try {
        // Vérifie si un utilisateur existe déjà pour éviter les duplications
        const existingUser = await User.findOne({ where: { email: 'admin@example.com' } });

        if (!existingUser) {
            // Crée un utilisateur si aucun n'existe encore
            await User.create({
                name: 'Admin',
                email: 'admin@example.com',
                password: 'password123', // Assure-toi de hasher le mot de passe en production
            });
            console.log('User seed completed');
        } else {
            console.log('User already exists, skipping seed');
        }
    } catch (error) {
        console.error('Error seeding user:', error);
    }
}