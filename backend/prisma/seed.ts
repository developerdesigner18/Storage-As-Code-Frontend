import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * Creates initial users for development
 */
async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@purefusion.com' },
        update: {},
        create: {
            email: 'admin@purefusion.com',
            passwordHash: adminPassword,
        },
    });

    console.log('✅ Created admin user:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@purefusion.com' },
        update: {},
        create: {
            email: 'user@purefusion.com',
            passwordHash: userPassword,
        },
    });

    console.log('✅ Created regular user:', user.email);

    console.log('\n📝 Default credentials:');
    console.log('   Admin: admin@purefusion.com / admin123');
    console.log('   User:  user@purefusion.com / user123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
