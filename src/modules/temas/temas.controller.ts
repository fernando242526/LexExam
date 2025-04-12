import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TemasService } from './temas.service';
import { TemaDto } from './dto/response-tema.dto';
import { CreateTemaDto } from './dto/create-tema.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterTemaDto } from './dto/filter-tema.dto';
import { TemaSelectDto } from './dto/select-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';

@ApiTags('Temas')
@Controller('temas')
export class TemasController {
  constructor(private readonly temasService: TemasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo tema', description: 'Crea un nuevo tema asociado a un balotario.' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Tema creado exitosamente', 
    type: TemaDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Balotario no encontrado' 
  })
  create(@Body() createTemaDto: CreateTemaDto): Promise<TemaDto> {
    return this.temasService.create(createTemaDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener temas', 
    description: 'Obtiene un listado de temas con filtros y paginación' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de temas', 
    type: PaginatedResponseDto
  })
  findAll(@Query() filterDto: FilterTemaDto): Promise<PaginatedResponseDto<TemaDto>> {
    return this.temasService.findAll(filterDto);
  }

  @Get('select')
  @ApiOperation({ 
    summary: 'Obtener temas para select', 
    description: 'Obtiene un listado simplificado de temas activos (id y título) para usar en selects' 
  })
  @ApiQuery({
    name: 'balotarioId',
    required: false,
    description: 'Filtrar por ID de balotario',
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de temas para select', 
    type: [TemaSelectDto]
  })
  findAllForSelect(@Query('balotarioId') balotarioId?: string): Promise<TemaSelectDto[]> {
    return this.temasService.findAllForSelect(balotarioId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un tema por ID', 
    description: 'Obtiene los detalles de un tema específico' 
  })
  @ApiParam({ name: 'id', description: 'ID del tema' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tema encontrado', 
    type: TemaDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tema no encontrado' 
  })
  findOne(@Param('id') id: string): Promise<TemaDto> {
    return this.temasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar tema', 
    description: 'Actualiza los datos de un tema existente' 
  })
  @ApiParam({ name: 'id', description: 'ID del tema' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tema actualizado exitosamente', 
    type: TemaDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tema no encontrado' 
  })
  update(
    @Param('id') id: string, 
    @Body() updateTemaDto: UpdateTemaDto
  ): Promise<TemaDto> {
    return this.temasService.update(id, updateTemaDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar tema', 
    description: 'Elimina un tema por su ID' 
  })
  @ApiParam({ name: 'id', description: 'ID del tema' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Tema eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Tema no encontrado' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.temasService.remove(id);
  }
}