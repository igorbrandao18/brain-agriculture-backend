import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { CreateRuralProducerUseCase } from '../../../core/producer/use-cases/create-rural-producer.usecase';
import { UpdateRuralProducerUseCase } from '../../../core/producer/use-cases/update-rural-producer.usecase';
import { DeleteRuralProducerUseCase } from '../../../core/producer/use-cases/delete-rural-producer.usecase';
import { DashboardUseCase } from '../../../core/producer/use-cases/dashboard.usecase';
import { CreateRuralProducerDto } from '../dtos/create-rural-producer.dto';
import { UpdateRuralProducerDto } from '../dtos/update-rural-producer.dto';
import { PrismaRuralProducerRepository } from '../../../infrastructure/producer/persistence/prisma-rural-producer.repository';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ProducerResponseDto } from '../dtos/producer-response.dto';
import { DashboardResponseDto } from '../dtos/dashboard-response.dto';
import { RuralProducer } from '../../../core/producer/domain/rural-producer.entity';
import { RuralProperty } from '../../../core/producer/domain/rural-property.entity';
import { Harvest } from '../../../core/producer/domain/harvest.entity';
import { PlantedCropLike } from '../../../core/producer/domain/harvest.entity';

@ApiTags('Producers')
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
  @ApiOperation({ summary: 'Obter dados agregados para o dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Dados do dashboard retornados com sucesso',
    type: DashboardResponseDto,
    examples: {
      success: {
        summary: 'Exemplo de resposta agregada',
        value: {
          totalFarms: 10,
          totalHectares: 1500,
          byState: [
            { state: 'GO', count: 5 },
            { state: 'MT', count: 3 },
          ],
          byCrop: [
            { crop: 'Soja', count: 800 },
            { crop: 'Milho', count: 400 },
          ],
          landUse: [
            { type: 'arable', total: 900 },
            { type: 'vegetation', total: 600 },
          ],
        },
      },
    },
  })
  async dashboard() {
    this.logger.log('Dashboard data requested');
    return this.dashboardUseCase.execute();
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Cadastrar novo produtor rural' })
  @ApiBody({
    type: CreateRuralProducerDto,
    examples: {
      valid: {
        summary: 'Payload válido',
        value: {
          name: 'João da Silva',
          document: '12345678909',
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
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Produtor criado com sucesso',
    type: ProducerResponseDto,
    examples: {
      success: {
        summary: 'Criação bem-sucedida',
        value: {
          id: '43e30055-9619-46f1-b4b4-4c919d02814e',
          name: 'João da Silva',
          document: '12345678909',
          farms: [
            {
              id: '7f7f435b-c0bb-456c-aa4a-40ec2af4021a',
              name: 'Fazenda Boa Vista',
              state: 'GO',
              totalArea: 100,
              arableArea: 60,
              vegetationArea: 40,
              crops: ['Soja', 'Milho'],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
    schema: {
      example: {
        statusCode: 400,
        message: 'CPF inválido',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Documento já cadastrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'Já existe um produtor com este CPF/CNPJ',
        error: 'Conflict',
      },
    },
  })
  async create(@Body() body: CreateRuralProducerDto) {
    console.log('Payload recebido no controller:', body);
    try {
      const producer = await this.createUseCase.execute(body);
      const response = mapProducerToResponse(producer);
      this.logger.log(`Producer created: ${producer.id}`);
      return response;
    } catch (e) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'status' in e &&
        typeof (e as Record<string, unknown>).status === 'number' &&
        (e as Record<string, unknown>).status === 409
      ) {
        throw new HttpException(
          (e as Record<string, unknown>).message as string,
          HttpStatus.CONFLICT,
        );
      }
      console.error('Erro completo no controller:', e);
      const errorMsg =
        typeof e === 'object' && e && 'message' in e
          ? String((e as Record<string, unknown>).message)
          : String(e);
      this.logger.error(`Error creating producer: ${errorMsg}`);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor rural por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produtor encontrado',
    type: ProducerResponseDto,
    examples: {
      found: {
        summary: 'Produtor encontrado',
        value: {
          id: '43e30055-9619-46f1-b4b4-4c919d02814e',
          name: 'João da Silva',
          document: '12345678909',
          farms: [
            {
              id: '7f7f435b-c0bb-456c-aa4a-40ec2af4021a',
              name: 'Fazenda Boa Vista',
              state: 'GO',
              totalArea: 100,
              arableArea: 60,
              vegetationArea: 40,
              crops: ['Soja', 'Milho'],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Produtor rural não encontrado.',
        error: 'Not Found',
      },
    },
  })
  async findById(@Param('id') id: string) {
    const producer = await this.repository.findById(id);
    if (!producer) {
      this.logger.warn(`Producer not found: ${id}`);
      throw new HttpException(
        'Produtor rural não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.log(`Producer fetched: ${id}`);
    return mapProducerToResponse(producer);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores rurais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso',
    schema: {
      example: [
        {
          id: '43e30055-9619-46f1-b4b4-4c919d02814e',
          name: 'João da Silva',
          document: '12345678909',
          farms: [
            {
              id: '7f7f435b-c0bb-456c-aa4a-40ec2af4021a',
              name: 'Fazenda Boa Vista',
              state: 'GO',
              totalArea: 100,
              arableArea: 60,
              vegetationArea: 40,
              crops: ['Soja', 'Milho'],
            },
          ],
        },
        {
          id: '98765432-1000-4000-8000-000000000000',
          name: 'Maria Souza',
          document: '98765432100',
          farms: [],
        },
      ],
    },
  })
  async findAll() {
    this.logger.log('All producers requested');
    const producers = await this.repository.findAll();
    return producers.map(mapProducerToResponse);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Atualizar produtor rural por ID' })
  @ApiBody({
    type: UpdateRuralProducerDto,
    examples: {
      update: {
        summary: 'Payload de atualização',
        value: {
          name: 'João da Silva Atualizado',
          document: '12345678909',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
    type: ProducerResponseDto,
    examples: {
      updated: {
        summary: 'Produtor atualizado',
        value: {
          id: '43e30055-9619-46f1-b4b4-4c919d02814e',
          name: 'João da Silva Atualizado',
          document: '12345678909',
          farms: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
    schema: {
      example: {
        statusCode: 400,
        message: 'CPF inválido',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Produtor rural não encontrado.',
        error: 'Not Found',
      },
    },
  })
  async update(@Param('id') id: string, @Body() body: UpdateRuralProducerDto) {
    try {
      const producer = await this.updateUseCase.execute({ id, ...body });
      this.logger.log(`Producer updated: ${id}`);
      return producer;
    } catch (e) {
      if (
        typeof e === 'object' &&
        e !== null &&
        e instanceof HttpException &&
        e.getStatus() === 404
      ) {
        throw e;
      }
      const updateErrorMsg =
        typeof e === 'object' && e && 'message' in e
          ? String((e as Record<string, unknown>).message)
          : String(e);
      this.logger.error(`Error updating producer ${id}: ${updateErrorMsg}`);
      throw new HttpException(updateErrorMsg, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produtor rural por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produtor removido com sucesso',
    schema: {
      example: {
        message: 'Produtor rural removido com sucesso.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Produtor rural não encontrado.',
        error: 'Not Found',
      },
    },
  })
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
    this.logger.log(`Producer deleted: ${id}`);
    return { message: 'Produtor rural removido com sucesso.' };
  }
}

function mapProducerToResponse(producer: RuralProducer) {
  return {
    id: producer.id,
    name: producer.name,
    document: producer.document,
    farms: (producer.properties || []).map((farm: RuralProperty) => ({
      id: farm.id,
      name: farm.name,
      state: farm.state,
      totalArea: farm.totalArea,
      arableArea: farm.arableArea,
      vegetationArea: farm.vegetationArea,
      crops:
        Array.isArray(
          (farm as unknown as Record<string, unknown>)['harvests'],
        ) &&
        (
          (farm as unknown as Record<string, unknown>)['harvests'] as Harvest[]
        )[0] &&
        Array.isArray(
          (
            (farm as unknown as Record<string, unknown>)[
              'harvests'
            ] as Harvest[]
          )[0].plantedCrops,
        )
          ? (
              (farm as unknown as Record<string, unknown>)[
                'harvests'
              ] as Harvest[]
            )[0].plantedCrops.map((crop: PlantedCropLike) => crop.name)
          : [],
    })),
  };
}
