import { Controller, Get, Param, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResumenEstadisticasDto } from './dto/response-resumen-estadistica.dto';
import { EstadisticasService } from './estadisticas.service';
import { EvolucionRendimientoDto } from './dto/response-evolucion-rendimiento.dto';
import { EstadisticaTemaDto } from './dto/response-estadistica-tema.dto';

@ApiTags('Estadísticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('resumen')
  @ApiOperation({ 
    summary: 'Obtener resumen de estadísticas', 
    description: 'Obtiene un resumen general de las estadísticas del usuario' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Resumen de estadísticas', 
    type: ResumenEstadisticasDto 
  })
  getResumenEstadisticas(): Promise<ResumenEstadisticasDto> {
    // En un sistema real, obtendríamos el ID del usuario del token JWT
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Usuario de prueba
    return this.estadisticasService.getResumenEstadisticas(usuarioId);
  }

  @Get('evolucion')
  @ApiOperation({ 
    summary: 'Obtener evolución del rendimiento', 
    description: 'Obtiene la evolución del rendimiento del usuario a lo largo del tiempo' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Evolución del rendimiento', 
    type: EvolucionRendimientoDto 
  })
  getEvolucionRendimiento(): Promise<EvolucionRendimientoDto> {
    // En un sistema real, obtendríamos el ID del usuario del token JWT
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Usuario de prueba
    return this.estadisticasService.getEvolucionRendimiento(usuarioId);
  }

  @Get('temas')
  @ApiOperation({ 
    summary: 'Obtener estadísticas por temas', 
    description: 'Obtiene las estadísticas de todos los temas estudiados por el usuario' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estadísticas por temas', 
    type: [EstadisticaTemaDto] 
  })
  getEstadisticasTemas(): Promise<EstadisticaTemaDto[]> {
    // En un sistema real, obtendríamos el ID del usuario del token JWT
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Usuario de prueba
    return this.estadisticasService.getEstadisticasTemas(usuarioId);
  }

  @Get('tema/:id')
  @ApiOperation({ 
    summary: 'Obtener estadísticas de un tema', 
    description: 'Obtiene las estadísticas detalladas de un tema específico' 
  })
  @ApiParam({ name: 'id', description: 'ID del tema' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Estadísticas del tema', 
    type: EstadisticaTemaDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'No hay estadísticas para el tema' 
  })
  getEstadisticasTema(@Param('id', ParseUUIDPipe) id: string): Promise<EstadisticaTemaDto> {
    // En un sistema real, obtendríamos el ID del usuario del token JWT
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Usuario de prueba
    return this.estadisticasService.getEstadisticasTema(id, usuarioId);
  }
}