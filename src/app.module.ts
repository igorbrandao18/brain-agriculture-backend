import { Module, Controller, Get } from '@nestjs/common';
import { ProducerModule } from './presentation/producer/producer.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Controller()
class AppController {
  @Get()
  getRoot(): string {
    return 'Hello World!';
  }
}

@Module({
  imports: [DatabaseModule, ProducerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
