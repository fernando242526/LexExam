import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { PreguntaDto } from './dto/response-pregunta.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterPreguntaDto } from './dto/filter-pregunta.dto';
import { PreguntaExamenDto } from './dto/response-pregunta-examen.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { PreguntasService } from './preguntas.service';
import { CreatePreguntasMasivoDto } from './dto/create-preguntas-masivas.dto';

@ApiTags('Preguntas')
@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva pregunta',
    description: 'Crea una nueva pregunta con sus respuestas asociadas a un tema.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pregunta creada exitosamente',
    type: PreguntaDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o sin respuestas correctas',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tema no encontrado',
  })
  create(@Body() createPreguntaDto: CreatePreguntaDto): Promise<PreguntaDto> {
    return this.preguntasService.create(createPreguntaDto);
  }

  @Post('masivo')
  @ApiOperation({
    summary: 'Crear múltiples preguntas',
    description: 'Crea varias preguntas con sus respuestas para un tema específico',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Preguntas creadas exitosamente',
    schema: {
      properties: {
        total: { type: 'number', example: 10 },
        creadas: { type: 'number', example: 8 },
        mensaje: { type: 'string', example: 'Se han creado 8 de 10 preguntas para el tema.' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tema no encontrado',
  })
  createMasivo(@Body() createMasivoDto: CreatePreguntasMasivoDto): Promise<{
    total: number;
    creadas: number;
    mensaje: string;
  }> {
    return this.preguntasService.createMasivo(createMasivoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener preguntas',
    description: 'Obtiene un listado de preguntas con filtros y paginación',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de preguntas',
    type: PaginatedResponseDto,
  })
  findAll(@Query() filterDto: FilterPreguntaDto): Promise<PaginatedResponseDto<PreguntaDto>> {
    return this.preguntasService.findAll(filterDto);
  }

  @Get('examen/:temaId/:cantidad')
  @ApiOperation({
    summary: 'Obtener preguntas aleatorias para examen',
    description: 'Obtiene un número específico de preguntas aleatorias de un tema para un examen',
  })
  @ApiParam({ name: 'temaId', description: 'ID del tema' })
  @ApiParam({ name: 'cantidad', description: 'Cantidad de preguntas a obtener' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Preguntas aleatorias para examen',
    type: [PreguntaExamenDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No hay suficientes preguntas disponibles',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tema no encontrado',
  })
  findRandomForExam(
    @Param('temaId', ParseUUIDPipe) temaId: string,
    @Param('cantidad', ParseIntPipe) cantidad: number,
  ): Promise<PreguntaExamenDto[]> {
    return this.preguntasService.findRandomForExam(temaId, cantidad);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una pregunta por ID',
    description: 'Obtiene los detalles de una pregunta específica con sus respuestas',
  })
  @ApiParam({ name: 'id', description: 'ID de la pregunta' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pregunta encontrada',
    type: PreguntaDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pregunta no encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PreguntaDto> {
    return this.preguntasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar pregunta',
    description: 'Actualiza los datos de una pregunta existente y sus respuestas',
  })
  @ApiParam({ name: 'id', description: 'ID de la pregunta' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pregunta actualizada exitosamente',
    type: PreguntaDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o sin respuestas correctas',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pregunta no encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePreguntaDto: UpdatePreguntaDto,
  ): Promise<PreguntaDto> {
    return this.preguntasService.update(id, updatePreguntaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar pregunta',
    description: 'Elimina una pregunta por su ID junto con todas sus respuestas',
  })
  @ApiParam({ name: 'id', description: 'ID de la pregunta' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pregunta eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pregunta no encontrada',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.preguntasService.remove(id);
  }
}
