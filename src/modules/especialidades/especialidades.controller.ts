import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EspecialidadesService } from './especialidades.service';
import { EspecialidadDto } from './dto/response-especialidad.dto';
import { CreateEspecialidadDto } from './dto/create-especialidade.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterEspecialidadDto } from './dto/filter-especialidad.dto';
import { EspecialidadSelectDto } from './dto/select-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Especialidades')
@Controller('especialidades')
@UseGuards(JwtAuthGuard) // Guard global para todas las rutas
@ApiBearerAuth() // Para mostrar el botón de autorización en Swagger
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR) // Solo administradores pueden crear
  @UseGuards(RolesGuard) // Guard para validar roles
  @ApiOperation({ summary: 'Crear nueva especialidad', description: 'Crea una nueva especialidad jurídica.' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Especialidad creada exitosamente', 
    type: EspecialidadDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Ya existe una especialidad con ese nombre' 
  })
  create(@Body() createEspecialidadDto: CreateEspecialidadDto): Promise<EspecialidadDto> {
    return this.especialidadesService.create(createEspecialidadDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener especialidades', 
    description: 'Obtiene un listado de especialidades con filtros y paginación' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de especialidades', 
    type: PaginatedResponseDto
  })
  findAll(@Query() filterDto: FilterEspecialidadDto): Promise<PaginatedResponseDto<EspecialidadDto>> {
    return this.especialidadesService.findAll(filterDto);
  }

  @Get('select')
  @ApiOperation({ 
    summary: 'Obtener especialidades para select', 
    description: 'Obtiene un listado simplificado de especialidades activas (id y nombre) para usar en selects' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de especialidades para select', 
    type: [EspecialidadSelectDto]
  })
  findAllForSelect(): Promise<EspecialidadSelectDto[]> {
    return this.especialidadesService.findAllForSelect();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una especialidad por ID', 
    description: 'Obtiene los detalles de una especialidad específica' 
  })
  @ApiParam({ name: 'id', description: 'ID de la especialidad' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Especialidad encontrada', 
    type: EspecialidadDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Especialidad no encontrada' 
  })
  findOne(@Param('id') id: string): Promise<EspecialidadDto> {
    return this.especialidadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar especialidad', 
    description: 'Actualiza los datos de una especialidad existente' 
  })
  @ApiParam({ name: 'id', description: 'ID de la especialidad' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Especialidad actualizada exitosamente', 
    type: EspecialidadDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Especialidad no encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Ya existe una especialidad con ese nombre' 
  })
  update(
    @Param('id') id: string, 
    @Body() updateEspecialidadDto: UpdateEspecialidadDto
  ): Promise<EspecialidadDto> {
    return this.especialidadesService.update(id, updateEspecialidadDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar especialidad', 
    description: 'Elimina una especialidad por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID de la especialidad' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Especialidad eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Especialidad no encontrada' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.especialidadesService.remove(id);
  }
}