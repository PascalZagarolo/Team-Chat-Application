import { PrismaClient } from '@prisma/client';


declare global {
    var prisma: PrismaClient | undefined;

};

export const db = globalThis.prisma || new PrismaClient();

// hinders the application to initliaze to many prisma clients in development mode
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}