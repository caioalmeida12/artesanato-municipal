import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create users
    const user1 = await prisma.user.create({
        data: {
            username: 'usuario1',
            password: 'senha1',
            email: 'usuario1@exemplo.com',
            role: 'USER',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'usuario2',
            password: 'senha2',
            email: 'usuario2@exemplo.com',
            role: 'VENDEDOR',
        },
    });

    // Create categories
    const category1 = await prisma.category.create({
        data: {
            name: 'Categoria 1',
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: 'Categoria 2',
        },
    });

    // Create products
    const products = [
        { name: 'Produto 1', description: 'Este artesanato é uma peça única feita à mão, representando a cultura local de Cedro, CE.', price: 10.0, categoryId: category1.id, userId: user1.id, quantity: 5 },
        { name: 'Produto 2', description: 'Uma obra de arte que reflete a tradição e a história do município de Cedro, CE.', price: 20.0, categoryId: category2.id, userId: user2.id, quantity: 10 },
        { name: 'Produto 3', description: 'Feito com materiais locais, este produto destaca a habilidade dos artesãos de Cedro, CE.', price: 30.0, categoryId: category1.id, userId: user1.id, quantity: 15 },
        { name: 'Produto 4', description: 'Uma peça artesanal que simboliza a rica herança cultural de Cedro, CE.', price: 40.0, categoryId: category2.id, userId: user2.id, quantity: 20 },
        { name: 'Produto 5', description: 'Este produto é um exemplo da dedicação e talento dos artesãos de Cedro, CE.', price: 50.0, categoryId: category1.id, userId: user1.id, quantity: 25 },
        { name: 'Produto 6', description: 'Uma criação única que celebra as tradições artesanais de Cedro, CE.', price: 60.0, categoryId: category2.id, userId: user2.id, quantity: 30 },
        { name: 'Produto 7', description: 'Artesanato local que mostra a beleza e a história de Cedro, CE.', price: 70.0, categoryId: category1.id, userId: user1.id, quantity: 35 },
        { name: 'Produto 8', description: 'Uma peça feita à mão que representa a cultura vibrante de Cedro, CE.', price: 80.0, categoryId: category2.id, userId: user2.id, quantity: 40 },
        { name: 'Produto 9', description: 'Este produto artesanal é um tributo à tradição e ao patrimônio de Cedro, CE.', price: 90.0, categoryId: category1.id, userId: user1.id, quantity: 45 },
        { name: 'Produto 10', description: 'Uma obra de arte que encapsula a essência do artesanato de Cedro, CE.', price: 100.0, categoryId: category2.id, userId: user2.id, quantity: 50 },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    // Create product images
    for (let i = 1; i <= 10; i++) {
        await prisma.productImage.create({
            data: {
                productId: i,
                imageUrl: 'https://via.placeholder.com/150',
            },
        });
    }

    // Create addresses
    const address1 = await prisma.address.create({
        data: {
            street: 'Rua Principal, 123',
            city: 'Cidade 1',
            state: 'Estado 1',
            zip: '12345-678',
            userId: user1.id,
        },
    });

    const address2 = await prisma.address.create({
        data: {
            street: 'Avenida Secundária, 456',
            city: 'Cidade 2',
            state: 'Estado 2',
            zip: '98765-432',
            userId: user2.id,
        },
    });

    // Create orders
    const order1 = await prisma.order.create({
        data: {
            userId: user1.id,
            addressId: address1.id,
            status: 'PENDING',
            total: 30.0,
            shippingCost: 5.0,
        },
    });

    const order2 = await prisma.order.create({
        data: {
            userId: user2.id,
            addressId: address2.id,
            status: 'CONFIRMED',
            total: 40.0,
            shippingCost: 5.0,
        },
    });

    // Create order items
    await prisma.orderItem.create({
        data: {
            orderId: order1.id,
            productId: 1,
            quantity: 2,
            price: 10.0,
        },
    });

    await prisma.orderItem.create({
        data: {
            orderId: order2.id,
            productId: 2,
            quantity: 2,
            price: 20.0,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("Database seeded");
        await prisma.$disconnect();
    });
