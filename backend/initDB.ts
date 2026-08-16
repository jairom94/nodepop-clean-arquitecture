import { PrismaUserRepository } from "./src/features/users/infraestructura/PrismaUserRepository.js";
import { User } from "./src/features/users/domain/User.js";
import { BcryptPasswordHasher } from "./src/infraestructura/security/BcryptPasswordHasher.js";
import { PrismaTagRepository } from "./src/features/tags/infraestructura/PrismaTagRepository.js";
import { Tag } from "./src/features/tags/domain/Tag.js";
import { PrismaProductRepository } from "./src/features/products/infraestructura/PrismaProductRepository.js";
import { Product } from "./src/features/products/domain/Product.js";
import { databaseClient } from "./src/database/prisma/PrismaDatabaseClient.js";

const DEFAULT_TAGS = ["motor", "work", "lifestyle", "mobile"];

const TEST_USER = {
  name: "Test",
  lastname1: "User",
  email: "test@nodepop.com",
  password: "123456",
};

const PRODUCTS = [
  { name: "Portátil MacBook Pro", price: 1299, tags: ["work", "mobile"] },
  { name: "Scooter eléctrico", price: 2500, tags: ["motor", "lifestyle"] },
];

async function initDB() {
  await databaseClient.connect();

  const tagRepository = new PrismaTagRepository();
  const userRepository = new PrismaUserRepository();
  const productRepository = new PrismaProductRepository();
  const passwordHasher = new BcryptPasswordHasher();

  const { product, user: userTable, tag, revokedToken } = databaseClient.db;

  await product.deleteMany({});
  await revokedToken.deleteMany({});
  await tag.deleteMany({});
  await userTable.deleteMany({});
  try {
    await databaseClient.db.$executeRawUnsafe("DELETE FROM sqlite_sequence");
  } catch {}
  console.log("Base de datos vaciada");

  for (const name of DEFAULT_TAGS) {
    const created = await tagRepository.create(new Tag({ id: null, name }));
    console.log(`Tag creado: ${created.name}`);
  }

  const hashedPassword = await passwordHasher.hash(TEST_USER.password);
  const user = await userRepository.create(
    new User({
      id: null,
      name: TEST_USER.name,
      lastname1: TEST_USER.lastname1,
      email: TEST_USER.email,
      password: hashedPassword,
    }),
  );
  console.log(`Usuario creado: ${user.email} (id ${user.id})`);

  for (const productData of PRODUCTS) {
    const created = await productRepository.create(
      new Product({
        id: null,
        name: productData.name,
        price: productData.price,
        ownerId: user.id as number,
        image: null,
        tags: productData.tags.map((name) => new Tag({ id: null, name })),
      }),
    );
    console.log(`Producto creado: ${created.name} (${created.price})`);
  }

  await databaseClient.disconnect();
  console.log("initDB completado");
}

initDB().catch((error) => {
  console.error(error);
  process.exit(1);
});
