import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../src/infrastructure/database/database.module';
import { ProducerResponseDto } from '../src/presentation/producer/dtos/producer-response.dto';
import { DashboardResponseDto } from '../src/presentation/producer/dtos/dashboard-response.dto';

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
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  beforeEach(async () => {
    // Limpa tabelas na ordem correta para evitar erro de constraint
    await prisma.plantedCrop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.ruralProperty.deleteMany();
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
    const body = res.body as ProducerResponseDto;
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('João');
    expect(body.document).toBe('12345678901');
  });

  it('/producers (POST) - should fail for invalid document', async () => {
    const res = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Inválido', document: '123' })
      .expect(400);
    expect((res.body as { message: string }).message).toContain(
      'O documento deve ter entre 11 (CPF) e 14 (CNPJ) caracteres.',
    );
  });

  it('/producers (POST) - should fail for duplicate document', async () => {
    await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'João', document: '12345678901' })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Outro', document: '12345678901' })
      .expect(409);
    expect((res.body as { message: string }).message).toContain(
      'Já existe um produtor com este CPF/CNPJ',
    );
  });

  it('/producers (POST) - should create a producer with farms and crops', async () => {
    const payload = {
      name: 'Maria',
      document: '98765432100',
      farms: [
        {
          name: 'Fazenda Boa Vista',
          state: 'GO',
          totalArea: 100,
          arableArea: 60,
          vegetationArea: 40,
          crops: ['Soja', 'Milho'],
        },
      ],
    };
    const res = await request(app.getHttpServer())
      .post('/producers')
      .send(payload)
      .expect(201);
    const body: ProducerResponseDto = res.body;
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Maria');
    expect(body.farms).toBeDefined();
    expect(body.farms[0].name).toBe('Fazenda Boa Vista');
    expect(body.farms[0].crops).toEqual(
      expect.arrayContaining(['Soja', 'Milho']),
    );
  });

  it('/producers (GET) - should list all producers', async () => {
    // Cria dois produtores
    await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'João', document: '12345678901' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'Maria', document: '98765432100' })
      .expect(201);
    // Lista todos
    const res = await request(app.getHttpServer())
      .get('/producers')
      .expect(200);
    const body = res.body as ProducerResponseDto[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('name');
    expect(body[0]).toHaveProperty('document');
  });

  it('/producers/:id (GET) - should get a producer by id', async () => {
    // Cria um produtor
    const createRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'João', document: '12345678901' })
      .expect(201);
    const id: string = (createRes.body as ProducerResponseDto).id;
    // Busca por id
    const res = await request(app.getHttpServer())
      .get(`/producers/${id}`)
      .expect(200);
    const body = res.body as unknown as ProducerResponseDto;
    expect(body).toHaveProperty('id', id);
    expect(body.name).toBe('João');
    expect(body.document).toBe('12345678901');
  });

  it('/producers/:id (GET) - should return 404 for non-existent id', async () => {
    const res = await request(app.getHttpServer())
      .get('/producers/999999')
      .expect(404);
    expect((res.body as { message: string }).message).toContain(
      'Produtor rural não encontrado',
    );
  });

  it('/producers/:id (PUT) - should update a producer', async () => {
    // Cria um produtor
    const createRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'João', document: '12345678901' })
      .expect(201);
    const id: string = (createRes.body as ProducerResponseDto).id;
    // Atualiza
    const updateRes = await request(app.getHttpServer())
      .put(`/producers/${id}`)
      .send({ name: 'João Atualizado', document: '12345678901' })
      .expect(200);
    const updateBody = updateRes.body as ProducerResponseDto;
    expect(updateBody).toHaveProperty('id', id);
    expect(updateBody.name).toBe('João Atualizado');
  });

  it('/producers/:id (PUT) - should return 404 for non-existent id', async () => {
    const res = await request(app.getHttpServer())
      .put('/producers/999999')
      .send({ name: 'Não Existe', document: '12345678901' })
      .expect(404);
    expect((res.body as { message: string }).message).toContain(
      'Produtor rural não encontrado',
    );
  });

  it('/producers/:id (DELETE) - should delete a producer', async () => {
    // Cria um produtor
    const createRes = await request(app.getHttpServer())
      .post('/producers')
      .send({ name: 'João', document: '12345678901' })
      .expect(201);
    const id: string = (createRes.body as ProducerResponseDto).id;
    // Remove
    const deleteRes = await request(app.getHttpServer())
      .delete(`/producers/${id}`)
      .expect(200);
    expect((deleteRes.body as { message: string }).message).toContain(
      'removido com sucesso',
    );
    // Confirma que não existe mais
    await request(app.getHttpServer()).get(`/producers/${id}`).expect(404);
  });

  it('/producers/:id (DELETE) - should return 404 for non-existent id', async () => {
    const res = await request(app.getHttpServer())
      .delete('/producers/999999')
      .expect(404);
    expect((res.body as { message: string }).message).toContain(
      'Produtor rural não encontrado',
    );
  });

  it('/producers/dashboard (GET) - should return dashboard data', async () => {
    // Cria produtores e fazendas
    await request(app.getHttpServer())
      .post('/producers')
      .send({
        name: 'João',
        document: '12345678901',
        farms: [
          {
            name: 'Fazenda 1',
            state: 'GO',
            totalArea: 100,
            arableArea: 60,
            vegetationArea: 40,
            crops: ['Soja', 'Milho'],
          },
        ],
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/producers')
      .send({
        name: 'Maria',
        document: '98765432100',
        farms: [
          {
            name: 'Fazenda 2',
            state: 'MT',
            totalArea: 50,
            arableArea: 30,
            vegetationArea: 20,
            crops: ['Soja'],
          },
        ],
      })
      .expect(201);
    // Dashboard
    const res = await request(app.getHttpServer())
      .get('/producers/dashboard')
      .expect(200);
    const dashboard = res.body as unknown as DashboardResponseDto;
    expect(dashboard).toHaveProperty('totalFarms');
    expect(dashboard).toHaveProperty('totalHectares');
    expect(dashboard).toHaveProperty('byState');
    expect(dashboard).toHaveProperty('byCrop');
    expect(dashboard).toHaveProperty('landUse');
    expect(typeof dashboard.totalFarms).toBe('number');
    expect(typeof dashboard.totalHectares).toBe('number');
    expect(Array.isArray(dashboard.byState)).toBe(true);
    expect(Array.isArray(dashboard.byCrop)).toBe(true);
    expect(Array.isArray(dashboard.landUse)).toBe(true);
  });
});
