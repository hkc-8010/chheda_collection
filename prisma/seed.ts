import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 12);
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('✅ Users created');

  // Create categories
  const tshirtsCategory = await prisma.category.upsert({
    where: { slug: 't-shirts' },
    update: {},
    create: {
      name: 'T-Shirts',
      description: 'Comfortable and stylish t-shirts for everyday wear',
      slug: 't-shirts',
      image: '/images/c-tshirts.jpg',
    },
  });

  const jeansCategory = await prisma.category.upsert({
    where: { slug: 'jeans' },
    update: {},
    create: {
      name: 'Jeans',
      description: 'Premium quality jeans in various styles and fits',
      slug: 'jeans',
      image: '/images/c-jeans.jpg',
    },
  });

  const shoesCategory = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: {
      name: 'Shoes',
      description: 'Comfortable and fashionable footwear for all occasions',
      slug: 'shoes',
      image: '/images/c-shoes.jpg',
    },
  });

  console.log('✅ Categories created');

  // Create T-Shirts products
  const tshirt1 = await prisma.product.upsert({
    where: { id: 'tshirt-1' },
    update: {},
    create: {
      id: 'tshirt-1',
      name: 'Classic Cotton T-Shirt',
      description: 'A comfortable and versatile cotton t-shirt perfect for casual wear. Made from 100% premium cotton with a relaxed fit.',
      price: 29.99,
      images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
      categoryId: tshirtsCategory.id,
      stock: 50,
    },
  });

  const tshirt2 = await prisma.product.upsert({
    where: { id: 'tshirt-2' },
    update: {},
    create: {
      id: 'tshirt-2',
      name: 'Premium Graphic Tee',
      description: 'Stylish graphic t-shirt with modern design. Soft fabric blend ensures comfort and durability.',
      price: 34.99,
      images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
      categoryId: tshirtsCategory.id,
      stock: 35,
    },
  });

  // Create Jeans products
  const jeans1 = await prisma.product.upsert({
    where: { id: 'jeans-1' },
    update: {},
    create: {
      id: 'jeans-1',
      name: 'Slim Fit Denim Jeans',
      description: 'Modern slim fit jeans crafted from premium denim. Features a comfortable stretch and classic five-pocket design.',
      price: 79.99,
      images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
      categoryId: jeansCategory.id,
      stock: 25,
    },
  });

  const jeans2 = await prisma.product.upsert({
    where: { id: 'jeans-2' },
    update: {},
    create: {
      id: 'jeans-2',
      name: 'Relaxed Straight Jeans',
      description: 'Comfortable relaxed fit jeans perfect for everyday wear. Made from durable denim with a timeless straight leg cut.',
      price: 69.99,
      images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
      categoryId: jeansCategory.id,
      stock: 30,
    },
  });

  // Create Shoes products
  const shoes1 = await prisma.product.upsert({
    where: { id: 'shoes-1' },
    update: {},
    create: {
      id: 'shoes-1',
      name: 'Casual Sneakers',
      description: 'Comfortable casual sneakers perfect for daily activities. Features cushioned sole and breathable upper material.',
      price: 89.99,
      images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
      categoryId: shoesCategory.id,
      stock: 40,
    },
  });

  const shoes2 = await prisma.product.upsert({
    where: { id: 'shoes-2' },
    update: {},
    create: {
      id: 'shoes-2',
      name: 'Athletic Running Shoes',
      description: 'High-performance running shoes with advanced cushioning technology. Lightweight design for optimal comfort and support.',
      price: 129.99,
      images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
      categoryId: shoesCategory.id,
      stock: 20,
    },
  });

  console.log('✅ Products created');

  // Create some sample reviews
  await prisma.review.createMany({
    data: [
      {
        userId: user1.id,
        productId: tshirt1.id,
        rating: 5,
        comment: 'Great quality t-shirt! Very comfortable and fits perfectly.',
      },
      {
        userId: user2.id,
        productId: tshirt1.id,
        rating: 4,
        comment: 'Nice fabric, good value for money.',
      },
      {
        userId: user1.id,
        productId: jeans1.id,
        rating: 5,
        comment: 'Perfect fit and excellent quality denim.',
      },
      {
        userId: user2.id,
        productId: shoes1.id,
        rating: 4,
        comment: 'Comfortable sneakers, great for walking.',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Reviews created');

  // Create sample addresses
  await prisma.address.createMany({
    data: [
      {
        userId: user1.id,
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      },
      {
        userId: user2.id,
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        isDefault: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Addresses created');

  console.log('🎉 Seed completed successfully!');
  console.log(`
📊 Summary:
- 3 Users created (1 admin, 2 regular users)
- 3 Categories created (T-Shirts, Jeans, Shoes)
- 6 Products created (2 per category)
- 4 Reviews created
- 2 Addresses created

🔑 Login credentials:
Admin: admin@example.com / admin123
User 1: john@example.com / user123
User 2: jane@example.com / user123
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
