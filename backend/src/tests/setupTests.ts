// Ensure tests use a dedicated test database so migrations/dev DB are not mixed
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./test.db";

// Optional: reduce Prisma query log noise during tests
process.env.PRISMA_LOG_QUERIES = "false";
