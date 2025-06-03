import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import Admin from './Models/Admin.js';
import Bread from './Models/Bread.js';
import Cashier from './Models/Cashier.js';
import Bill from './Models/Bill.js';

dotenv.config();

const ADMIN_PLAIN_PASSWORD = '12345';
const CASHIER_PLAIN_PASSWORD = '123';

const sampleAdmins = [
    {
        name: "Main Admin",
        email: "admin@breadbill.com",
        phone: "9876543210",
        image: "https://icon-library.com/images/admin-icon-png/admin-icon-png-28.jpg",
        gender: "Male",
        birthday: new Date("1990-05-15"),
        joinedAt: new Date(),
    },
];

const sampleCashiers = [
    {
        name: "Regular Cashier",
        email: "cashier@breadbill.com",
        phone: "1122334455",
        image: "https://thumbs.dreamstime.com/b/reception-receptionist-desk-blue-color-office-service-icon-beautiful-design-fully-editable-lobby-commercial-print-media-180383525.jpg",
        gender: "Female",
        birthday: new Date("1995-03-10"),
        joinedAt: new Date(),
    },
];

const sampleBreads = [
    {
        name: "Classic White Loaf",
        amount: 50,
        description: "Soft and fluffy white bread, perfect for sandwiches.",
        image: "https://example.com/images/white_loaf.jpg"
    },
    {
        name: "Multigrain Bread",
        amount: 85,
        description: "Packed with healthy grains and seeds.",
        image: "https://example.com/images/multigrain.jpg"
    },
    {
        name: "Croissant (Single)",
        amount: 30,
        description: "Flaky, buttery French pastry.",
        image: "https://example.com/images/croissant.jpg"
    },
    {
        name: "Baguette",
        amount: 60,
        description: "Crusty on the outside, soft on the inside.",
        image: "C:\Users\PRAKHAR\Desktop\project\Breadbilling-main\server\Images\baguette-bread.png"
    },
    {
        name: "Chocolate Chip Cookie",
        amount: 25,
        description: "Homemade style, gooey chocolate chips.",
        image: "https://example.com/images/cookie.jpg"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for seeding!');

        await Admin.deleteMany({});
        await Cashier.deleteMany({});
        await Bread.deleteMany({});
        await Bill.deleteMany({});
        console.log('All existing data cleared.');

        console.log('Hashing admin password and inserting Admins...');
        const hashedAdminPassword = await bcrypt.hash(ADMIN_PLAIN_PASSWORD, 10);
        const adminsToInsert = sampleAdmins.map(admin => ({
            ...admin,
            password: hashedAdminPassword
        }));
        await Admin.insertMany(adminsToInsert);
        console.log(`Inserted ${adminsToInsert.length} admin(s).`);
        console.log(`Admin login email: ${sampleAdmins[0].email}`);
        console.log(`Admin login password: ${ADMIN_PLAIN_PASSWORD}`);

        console.log('Hashing cashier password and inserting Cashiers...');
        const hashedCashierPassword = await bcrypt.hash(CASHIER_PLAIN_PASSWORD, 10);
        const cashiersToInsert = sampleCashiers.map(cashier => ({
            ...cashier,
            password: hashedCashierPassword
        }));
        await Cashier.insertMany(cashiersToInsert);
        console.log(`Inserted ${cashiersToInsert.length} cashier(s).`);
        console.log(`Cashier login email: ${sampleCashiers[0].email}`);
        console.log(`Cashier login password: ${CASHIER_PLAIN_PASSWORD}`);

        console.log('Inserting Breads...');
        await Bread.insertMany(sampleBreads);
        console.log(`Inserted ${sampleBreads.length} bread item(s).`);

        console.log('\n--- Database seeding complete! ---');
        console.log('You can now try logging in with the provided admin/cashier credentials.');

    } catch (error) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        }
    }
};

seedDB();
