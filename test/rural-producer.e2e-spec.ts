import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../src/infrastructure/database/database.module';

describe('RuralProducerController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PRISMA_CLIENT)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  beforeEach(async () => {
    // Limpa a tabela antes de cada teste
    await prisma.ruralProducer.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('/producers (POST) - should create a producer', async () => {
    const res = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'João', document: '12345678901' })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('João');
    expect(res.body.document).toBe('12345678901');
  });

  it('/producers (POST) - should fail for invalid document', async () => {
    const res = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Inválido', document: '123' })
      .expect(400);
    expect(res.body.message).toContain('O documento deve ter entre 11 (CPF) e 14 (CNPJ) caracteres.');
  });
}); 