import { Controller, Get, Post, Body, Param, Query, HttpStatus, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExamenesService } from './examenes.service';
import { ExamenDto } from './dto/response-examen.dto';
import { CrearExamenDto } from './dto/create-examene.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterExamenDto } from './dto/filter-examen.dto';
import { ExamenConPreguntasDto } from './dto/response-examen-con-preguntas.dto';
import { IniciarExamenDto } from './dto/iniciar-examen.dto';
import { ResultadoExamenDto } from './dto/response-resultado-examen.dto';
import { EnviarRespuestasDto } from './dto/enviar-respuesta.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Exámenes')
@UseGuards(JwtAuthGuard)
@Controller('examenes')
export class ExamenesController {
  constructor(private readonly examenesService: ExamenesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo examen', description: 'Crea un nuevo examen para un tema específico' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Examen creado exitosamente', 
    type: ExamenDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tema no encontrado' 
  })
  crearExamen(
    @Body() crearExamenDto: CrearExamenDto,
    @GetUser('id') usuarioId: string
  ): Promise<ExamenDto> {
    return this.examenesService.crearExamen(crearExamenDto, usuarioId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener exámenes', 
    description: 'Obtiene un listado de exámenes del usuario con filtros y paginación' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de exámenes', 
    type: PaginatedResponseDto
  })
  findAll(
    @Query() filterDto: FilterExamenDto,
    @GetUser('id') usuarioId: string
  ): Promise<PaginatedResponseDto<ExamenDto>> {
    return this.examenesService.findAll(filterDto, usuarioId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un examen por ID', 
    description: 'Obtiene los detalles de un examen específico' 
  })
  @ApiParam({ name: 'id', description: 'ID del examen' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Examen encontrado', 
    type: ExamenDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Examen no encontrado' 
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') usuarioId: string
  ): Promise<ExamenDto> {
    return this.examenesService.findOne(id, usuarioId);
  }

  @Post('iniciar')
  @ApiOperation({ 
    summary: 'Iniciar examen', 
    description: 'Inicia un examen y devuelve las preguntas' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Examen iniciado exitosamente', 
    type: ExamenConPreguntasDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Examen no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El examen ya ha sido iniciado o finalizado' 
  })
  iniciarExamen(
    @Body() iniciarExamenDto: IniciarExamenDto,
    @GetUser('id') usuarioId: string
  ): Promise<ExamenConPreguntasDto> {
    return this.examenesService.iniciarExamen(iniciarExamenDto, usuarioId);
  }

  @Get(':id/continuar')
  @ApiOperation({ 
    summary: 'Continuar examen', 
    description: 'Continúa un examen ya iniciado y devuelve las preguntas' 
  })
  @ApiParam({ name: 'id', description: 'ID del examen' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Datos del examen para continuar', 
    type: ExamenConPreguntasDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Examen no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El examen no está en estado INICIADO o ha caducado' 
  })
  continuarExamen(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') usuarioId: string
  ): Promise<ExamenConPreguntasDto> {
    return this.examenesService.continuarExamen(id, usuarioId);
  }

  @Post('enviar-respuestas')
  @ApiOperation({ 
    summary: 'Enviar respuestas', 
    description: 'Envía las respuestas del examen y devuelve los resultados' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Respuestas enviadas exitosamente', 
    type: ResultadoExamenDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Examen no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El examen no está en estado INICIADO o el tiempo ha expirado' 
  })
  enviarRespuestas(
    @Body() enviarRespuestasDto: EnviarRespuestasDto,
    @GetUser('id') usuarioId: string
  ): Promise<ResultadoExamenDto> {
    return this.examenesService.enviarRespuestas(enviarRespuestasDto, usuarioId);
  }

  @Get(':id/resultado')
  @ApiOperation({ 
    summary: 'Obtener resultado de examen', 
    description: 'Obtiene el resultado de un examen específico con todas las respuestas' 
  })
  @ApiParam({ name: 'id', description: 'ID del examen' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Resultado del examen', 
    type: ResultadoExamenDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Examen o resultado no encontrado' 
  })
  getResultadoExamen(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') usuarioId: string
  ): Promise<ResultadoExamenDto> {
    return this.examenesService.getResultadoExamen(id, usuarioId);
  }

  @Get('resultados/historial')
  @ApiOperation({ 
    summary: 'Obtener historial de resultados', 
    description: 'Obtiene el historial de resultados de exámenes del usuario con paginación' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Historial de resultados', 
    type: PaginatedResponseDto
  })
  getResultadosExamen(
    @Query() filterDto: FilterExamenDto,
    @GetUser('id') usuarioId: string
  ): Promise<PaginatedResponseDto<ResultadoExamenDto>> {
    return this.examenesService.getResultadosExamen(filterDto, usuarioId);
  }

  @Get(':id/estado')
  @ApiOperation({ 
    summary: 'Verificar estado de examen', 
    description: 'Verifica el estado de un examen (tiempo restante, estado, etc.)' 
  })
  @ApiParam({ name: 'id', description: 'ID del examen' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estado del examen',
    schema: {
      properties: {
        examenId: { type: 'string', format: 'uuid' },
        estado: { type: 'string', enum: ['PENDIENTE', 'INICIADO', 'FINALIZADO', 'CADUCADO'] },
        tiempoRestante: { type: 'number', nullable: true, description: 'Tiempo restante en segundos' },
        tiempoTotal: { type: 'number', description: 'Tiempo total en segundos' },
        porcentajeCompletado: { type: 'number', description: 'Porcentaje de tiempo completado' }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Examen no encontrado' 
  })
  verificarEstadoExamen(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') usuarioId: string
  ): Promise<{
    examenId: string;
    estado: string;
    tiempoRestante: number | null;
    tiempoTotal: number;
    porcentajeCompletado: number;
  }> {
    return this.examenesService.verificarEstadoExamen(id, usuarioId);
  }
}