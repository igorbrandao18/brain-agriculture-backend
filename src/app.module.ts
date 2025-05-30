import { Module } from '@nestjs/common';
import { ProducerModule } from './presentation/producer/producer.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, ProducerModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 