import { Module } from '@nestjs/common';
import { RuralProducerController } from './controllers/rural-producer.controller';
import { PrismaRuralProducerRepository } from '../../infrastructure/producer/persistence/prisma-rural-producer.repository';
import { CreateRuralProducerUseCase } from '../../core/producer/use-cases/create-rural-producer.usecase';
import { UpdateRuralProducerUseCase } from '../../core/producer/use-cases/update-rural-producer.usecase';
import { DeleteRuralProducerUseCase } from '../../core/producer/use-cases/delete-rural-producer.usecase';
import { DashboardUseCase } from '../../core/producer/use-cases/dashboard.usecase';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RuralProducerController],
  providers: [
    PrismaRuralProducerRepository,
    CreateRuralProducerUseCase,
    UpdateRuralProducerUseCase,
    DeleteRuralProducerUseCase,
    DashboardUseCase,
    {
      provide: CreateRuralProducerUseCase,
      useFactory: (repo: PrismaRuralProducerRepository) =>
        new CreateRuralProducerUseCase(repo),
      inject: [PrismaRuralProducerRepository],
    },
    {
      provide: UpdateRuralProducerUseCase,
      useFactory: (repo: PrismaRuralProducerRepository) =>
        new UpdateRuralProducerUseCase(repo),
      inject: [PrismaRuralProducerRepository],
    },
    {
      provide: DeleteRuralProducerUseCase,
      useFactory: (repo: PrismaRuralProducerRepository) =>
        new DeleteRuralProducerUseCase(repo),
      inject: [PrismaRuralProducerRepository],
    },
    {
      provide: DashboardUseCase,
      useFactory: (repo: PrismaRuralProducerRepository) =>
        new DashboardUseCase(repo),
      inject: [PrismaRuralProducerRepository],
    },
  ],
  exports: [
    PrismaRuralProducerRepository,
    CreateRuralProducerUseCase,
    UpdateRuralProducerUseCase,
    DeleteRuralProducerUseCase,
    DashboardUseCase,
  ],
})
export class ProducerModule {}
