import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { EstadisticaTema } from './entities/estadistica.entity';
import { ResultadoExamen } from '../examenes/entities/resultado-examen.entity';
import { EstadisticaTemaDto } from './dto/response-estadistica-tema.dto';
import { ResumenEstadisticasDto } from './dto/response-resumen-estadistica.dto';
import { EvolucionRendimientoDto } from './dto/response-evolucion-rendimiento.dto';
import { DateUtils } from 'src/common/utils/date.util';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(EstadisticaTema)
    private estadisticaTemaRepository: Repository<EstadisticaTema>,
    @InjectRepository(ResultadoExamen)
    private resultadoExamenRepository: Repository<ResultadoExamen>,
  ) {}

  /**
   * Actualiza las estadísticas de un tema después de un examen
   * (Este método sería llamado desde ExamenesService después de enviar respuestas)
   */
  async actualizarEstadisticasDespuesDeExamen(
    temaId: string,
    usuarioId: string,
    totalPreguntas: number,
    acertadas: number,
    duracionMinutos: number
  ): Promise<void> {
    // Buscar si ya existen estadísticas para este tema y usuario
    let estadistica = await this.estadisticaTemaRepository.findOne({
      where: {
        tema: { id: temaId },
        usuario: { id: usuarioId },
      },
    });
    
    // Si no existen, crear una nueva entrada
    if (!estadistica) {
      estadistica = this.estadisticaTemaRepository.create({
        totalPreguntas: 0,
        acertadas: 0,
        porcentajeAcierto: 0,
        examenesRealizados: 0,
        tiempoPromedio: 0,
        tema: { id: temaId },
        usuario: { id: usuarioId },
      });
    }
    
    // Actualizar estadísticas
    estadistica.totalPreguntas += totalPreguntas;
    estadistica.acertadas += acertadas;
    estadistica.examenesRealizados += 1;
    
    // Calcular nuevo porcentaje de acierto
    estadistica.porcentajeAcierto = parseFloat(
      ((estadistica.acertadas / estadistica.totalPreguntas) * 100).toFixed(2)
    );
    
    // Calcular nuevo tiempo promedio por pregunta (en segundos)
    const tiempoTotalSegundos = duracionMinutos * 60;
    const tiempoPorPregunta = tiempoTotalSegundos / totalPreguntas;
    
    // Actualizar tiempo promedio (ponderado con exámenes anteriores)
    const tiempoTotalAnterior = estadistica.tiempoPromedio * (estadistica.totalPreguntas - totalPreguntas);
    const tiempoTotalNuevo = tiempoTotalAnterior + (tiempoPorPregunta * totalPreguntas);
    estadistica.tiempoPromedio = parseFloat(
      (tiempoTotalNuevo / estadistica.totalPreguntas).toFixed(2)
    );
    
    // Guardar estadísticas actualizadas
    await this.estadisticaTemaRepository.save(estadistica);
  }

  /**
   * Obtiene las estadísticas para un tema específico
   */
  async getEstadisticasTema(temaId: string, usuarioId: string): Promise<EstadisticaTemaDto> {
    const estadistica = await this.estadisticaTemaRepository.findOne({
      where: { 
        tema: { id: temaId }, 
        usuario: { id: usuarioId } 
      },
      relations: { tema: true, usuario: true },
    });
    
    if (!estadistica) {
      throw new NotFoundException(`No hay estadísticas para el tema con ID ${temaId}`);
    }
    
    return new EstadisticaTemaDto(estadistica);
  }

  /**
   * Obtiene las estadísticas para todos los temas estudiados por el usuario
   */
  async getEstadisticasTemas(usuarioId: string): Promise<EstadisticaTemaDto[]> {
    const estadisticas = await this.estadisticaTemaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { tema: true, usuario: true },
      order: { porcentajeAcierto: 'DESC' },
    });
    
    return estadisticas.map(estadistica => new EstadisticaTemaDto(estadistica));
  }

  /**
   * Obtiene un resumen general de las estadísticas del usuario
   */
  async getResumenEstadisticas(usuarioId: string): Promise<ResumenEstadisticasDto> {
    // Obtener todas las estadísticas del usuario
    const estadisticas = await this.estadisticaTemaRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { tema: true },
    });
    
    // Obtener todos los resultados de exámenes del usuario
    const resultados = await this.resultadoExamenRepository.find({
      where: { usuario: { id: usuarioId } },
    });
    
    // Calcular resumen
    const totalExamenes = resultados.length;
    const totalPreguntas = estadisticas.reduce((sum, est) => sum + est.totalPreguntas, 0);
    const totalAciertos = estadisticas.reduce((sum, est) => sum + est.acertadas, 0);
    const porcentajeGlobalAciertos = totalPreguntas > 0 
      ? parseFloat(((totalAciertos / totalPreguntas) * 100).toFixed(2)) 
      : 0;
    const temasEstudiados = estadisticas.length;
    
    // Calcular tiempo total de estudio en minutos
    const tiempoTotalEstudio = resultados.reduce((sum, res) => sum + res.duracionReal, 0);
    
    // Calcular puntuación promedio y mejor puntuación
    const puntuaciones = resultados.map(res => res.puntuacionTotal);
    const puntuacionPromedio = puntuaciones.length > 0 
      ? parseFloat((puntuaciones.reduce((sum, p) => sum + p, 0) / puntuaciones.length).toFixed(2)) 
      : 0;
    const mejorPuntuacion = puntuaciones.length > 0 
      ? Math.max(...puntuaciones) 
      : 0;
    
    // Encontrar el tema con mejor rendimiento
    const mejorTema = estadisticas.length > 0 
      ? estadisticas.reduce((mejor, actual) => 
          actual.porcentajeAcierto > mejor.porcentajeAcierto ? actual : mejor, 
          estadisticas[0])
      : null;
    
    const mejorTemaInfo = mejorTema ? {
      id: mejorTema.tema.id,
      titulo: mejorTema.tema?.titulo || 'Desconocido',
      porcentajeAcierto: mejorTema.porcentajeAcierto,
    } : null;
    
    return {
      totalExamenes,
      totalPreguntas,
      totalAciertos,
      porcentajeGlobalAciertos,
      temasEstudiados,
      tiempoTotalEstudio,
      puntuacionPromedio,
      mejorPuntuacion,
      mejorTema: mejorTemaInfo,
    };
  }

  /**
   * Obtiene la evolución del rendimiento a lo largo del tiempo
   */
  async getEvolucionRendimiento(usuarioId: string): Promise<EvolucionRendimientoDto> {
    // Obtener todos los resultados de exámenes ordenados por fecha
    const resultados = await this.resultadoExamenRepository.find({
      where: { usuario: { id: usuarioId } },
      order: { fechaInicio: 'ASC' },
    });
    
    // Mapear a puntos de rendimiento
    const puntosRendimiento = resultados.map(resultado => ({
      fecha: DateUtils.formatDate(resultado.fechaInicio),
      puntuacion: resultado.puntuacionTotal,
    }));
    
    // Calcular promedio histórico
    const puntuaciones = resultados.map(res => res.puntuacionTotal);
    const promedioHistorico = puntuaciones.length > 0 
      ? parseFloat((puntuaciones.reduce((sum, p) => sum + p, 0) / puntuaciones.length).toFixed(2)) 
      : 0;
    
    // Calcular tendencia
    let tendencia: 'positiva' | 'negativa' | 'estable' = 'estable';
    
    if (puntuaciones.length >= 3) {
      // Calcular promedio de los primeros exámenes vs los últimos
      const mitad = Math.floor(puntuaciones.length / 2);
      const primerosExamenes = puntuaciones.slice(0, mitad);
      const ultimosExamenes = puntuaciones.slice(-mitad);
      
      const promedioInicial = primerosExamenes.reduce((sum, p) => sum + p, 0) / primerosExamenes.length;
      const promedioFinal = ultimosExamenes.reduce((sum, p) => sum + p, 0) / ultimosExamenes.length;
      
      // Determinar tendencia
      const diferencia = promedioFinal - promedioInicial;
      if (diferencia > 5) {
        tendencia = 'positiva';
      } else if (diferencia < -5) {
        tendencia = 'negativa';
      }
    }
    
    return {
      puntosRendimiento,
      promedioHistorico,
      tendencia,
    };
  }
}