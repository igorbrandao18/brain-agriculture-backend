import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const PRISMA_CLIENT = 'PRISMA_CLIENT';

@Module({
  providers: [
    {
      provide: PRISMA_CLIENT,
      useFactory: () => new PrismaClient(),
    },
  ],
  exports: [PRISMA_CLIENT],
})
export class DatabaseModule {}
