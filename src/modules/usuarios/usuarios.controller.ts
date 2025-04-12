import { Controller, Get, Patch, Param, Body, Query, UseGuards, HttpStatus, ParseUUIDPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolUsuario } from './entities/usuario.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UsuarioDto } from './dto/response-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ 
    summary: 'Obtener usuarios', 
    description: 'Obtiene un listado de usuarios con paginación y filtros' 
  })
  @ApiQuery({ name: 'page', description: 'Número de página', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Elementos por página', required: false, type: Number })
  @ApiQuery({ name: 'search', description: 'Buscar por nombre de usuario', required: false, type: String })
  @ApiQuery({ name: 'rol', description: 'Filtrar por rol', required: false, enum: RolUsuario })
  @ApiQuery({ name: 'activo', description: 'Filtrar por estado', required: false, type: Boolean })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de usuarios', 
    type: PaginatedResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Prohibido - No tiene permisos' 
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('rol') rol?: RolUsuario,
    @Query('activo') activo?: boolean,
  ): Promise<PaginatedResponseDto<UsuarioDto>> {
    return this.usuariosService.findAll(paginationDto, search, rol, activo);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ 
    summary: 'Obtener un usuario por ID', 
    description: 'Obtiene los detalles de un usuario específico' 
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario encontrado', 
    type: UsuarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Prohibido - No tiene permisos' 
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioDto> {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ 
    summary: 'Actualizar usuario', 
    description: 'Actualiza los datos de un usuario existente' 
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario actualizado exitosamente', 
    type: UsuarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Prohibido - No tiene permisos' 
  })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ): Promise<UsuarioDto> {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Patch(':id/activo')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ 
    summary: 'Activar/Desactivar usuario', 
    description: 'Activa o desactiva un usuario existente' 
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiQuery({ name: 'activo', description: 'Estado a establecer (true/false)', type: Boolean })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estado de usuario actualizado exitosamente', 
    type: UsuarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Prohibido - No tiene permisos' 
  })
  toggleActivo(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('activo', ParseBoolPipe) activo: boolean
  ): Promise<UsuarioDto> {
    return this.usuariosService.toggleActivo(id, activo);
  }

  @Patch(':id/rol')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ 
    summary: 'Cambiar rol de usuario', 
    description: 'Cambia el rol de un usuario existente' 
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiQuery({ name: 'rol', description: 'Rol a establecer', enum: RolUsuario })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Rol de usuario actualizado exitosamente', 
    type: UsuarioDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Prohibido - No tiene permisos' 
  })
  changeRol(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('rol') rol: RolUsuario
  ): Promise<UsuarioDto> {
    return this.usuariosService.changeRol(id, rol);
  }
}