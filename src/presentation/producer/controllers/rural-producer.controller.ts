import { Controller, Post, Body, Get, Param, Put, Delete, HttpException, HttpStatus, UsePipes, ValidationPipe, Inject, Logger } from '@nestjs/common';
import { CreateRuralProducerUseCase } from '../../../core/producer/use-cases/create-rural-producer.usecase';
import { UpdateRuralProducerUseCase } from '../../../core/producer/use-cases/update-rural-producer.usecase';
import { DeleteRuralProducerUseCase } from '../../../core/producer/use-cases/delete-rural-producer.usecase';
import { DashboardUseCase } from '../../../core/producer/use-cases/dashboard.usecase';
import { CreateRuralProducerDto } from '../dtos/create-rural-producer.dto';
import { UpdateRuralProducerDto } from '../dtos/update-rural-producer.dto';
import { PrismaRuralProducerRepository } from '../../../infrastructure/producer/persistence/prisma-rural-producer.repository';

@Controller('producers')
export class RuralProducerController {
  private readonly logger = new Logger(RuralProducerController.name);

  constructor(
    private readonly createUseCase: CreateRuralProducerUseCase,
    private readonly updateUseCase: UpdateRuralProducerUseCase,
    private readonly deleteUseCase: DeleteRuralProducerUseCase,
    private readonly dashboardUseCase: DashboardUseCase,
    private readonly repository: PrismaRuralProducerRepository,
  ) {}

  @Get('dashboard')
  async dashboard() {
    this.logger.log('Dashboard data requested');
    return this.dashboardUseCase.execute();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() body: CreateRuralProducerDto) {
    try {
      const producer = await this.createUseCase.execute(body);
      this.logger.log(`Producer created: ${producer.id}`);
      return producer;
    } catch (e) {
      this.logger.error(`Error creating producer: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const producer = await this.repository.findById(id);
    if (!producer) {
      this.logger.warn(`Producer not found: ${id}`);
      throw new HttpException('Produtor rural não encontrado.', HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Producer fetched: ${id}`);
    return producer;
  }

  @Get()
  async findAll() {
    this.logger.log('All producers requested');
    return this.repository.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: string, @Body() body: UpdateRuralProducerDto) {
    try {
      const producer = await this.updateUseCase.execute({ id, ...body });
      this.logger.log(`Producer updated: ${id}`);
      return producer;
    } catch (e) {
      this.logger.error(`Error updating producer ${id}: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
    this.logger.log(`Producer deleted: ${id}`);
    return { message: 'Produtor rural removido com sucesso.' };
  }
} 