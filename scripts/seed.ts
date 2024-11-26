const { PrismaClient } = require('@prisma/client') 

const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Computer Science' },
                { name: 'Medicine' },
                { name: 'Business' },
                { name: 'Engineering' },
                { name: 'Actuarial Science' },
                { name: 'Fitness' },
                { name: 'Politics' },
                { name: 'Economics' },
            ]
        });

        console.log("Categories seeded successfully")
    } catch (error) {
        console.log("Error seeding categories", error)
    } finally {
        await database.$disconnect()
    }
}

main();