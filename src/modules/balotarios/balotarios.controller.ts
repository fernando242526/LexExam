import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BalotariosService } from './balotarios.service';
import { BalotarioDto } from './dto/response-balotari.dto';
import { CreateBalotarioDto } from './dto/create-balotario.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterBalotarioDto } from './dto/filter-balotario.dto';
import { BalotarioSelectDto } from './dto/select-balotario.dto';
import { UpdateBalotarioDto } from './dto/update-balotario.dto';


@ApiTags('Balotarios')
@Controller('balotarios')
export class BalotariosController {
  constructor(private readonly balotariosService: BalotariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo balotario', description: 'Crea un nuevo balotario asociado a una especialidad.' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Balotario creado exitosamente', 
    type: BalotarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Especialidad no encontrada' 
  })
  create(@Body() createBalotarioDto: CreateBalotarioDto): Promise<BalotarioDto> {
    return this.balotariosService.create(createBalotarioDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener balotarios', 
    description: 'Obtiene un listado de balotarios con filtros y paginación' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de balotarios', 
    type: PaginatedResponseDto
  })
  findAll(@Query() filterDto: FilterBalotarioDto): Promise<PaginatedResponseDto<BalotarioDto>> {
    return this.balotariosService.findAll(filterDto);
  }

  @Get('select')
  @ApiOperation({ 
    summary: 'Obtener balotarios para select', 
    description: 'Obtiene un listado simplificado de balotarios activos (id y nombre) para usar en selects' 
  })
  @ApiQuery({
    name: 'especialidadId',
    required: false,
    description: 'Filtrar por ID de especialidad',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de balotarios para select', 
    type: [BalotarioSelectDto]
  })
  findAllForSelect(@Query('especialidadId') especialidadId?: string): Promise<BalotarioSelectDto[]> {
    return this.balotariosService.findAllForSelect(especialidadId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un balotario por ID', 
    description: 'Obtiene los detalles de un balotario específico' 
  })
  @ApiParam({ name: 'id', description: 'ID del balotario' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Balotario encontrado', 
    type: BalotarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Balotario no encontrado' 
  })
  findOne(@Param('id') id: string): Promise<BalotarioDto> {
    return this.balotariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar balotario', 
    description: 'Actualiza los datos de un balotario existente' 
  })
  @ApiParam({ name: 'id', description: 'ID del balotario' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Balotario actualizado exitosamente', 
    type: BalotarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Balotario no encontrado' 
  })
  update(
    @Param('id') id: string, 
    @Body() updateBalotarioDto: UpdateBalotarioDto
  ): Promise<BalotarioDto> {
    return this.balotariosService.update(id, updateBalotarioDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar balotario', 
    description: 'Elimina un balotario por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID del balotario' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Balotario eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Balotario no encontrado' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.balotariosService.remove(id);
  }
}