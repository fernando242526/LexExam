import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  DataSource,
} from 'typeorm';
import { EstadoExamen, Examen } from './entities/examen.entity';
import { ResultadoExamen } from './entities/resultado-examen.entity';
import { RespuestaUsuario } from './entities/respuesta-usuario.entity';
import { TemasService } from '../temas/temas.service';
import { PreguntasService } from '../preguntas/preguntas.service';
import { CrearExamenDto } from './dto/create-examene.dto';
import { ExamenDto } from './dto/response-examen.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterExamenDto } from './dto/filter-examen.dto';
import { IniciarExamenDto } from './dto/iniciar-examen.dto';
import { ExamenConPreguntasDto } from './dto/response-examen-con-preguntas.dto';
import { EnviarRespuestasDto } from './dto/enviar-respuesta.dto';
import { ResultadoExamenDto } from './dto/response-resultado-examen.dto';
import { DateUtils } from 'src/common/utils/date.util';
import { EstadisticasService } from '../estadisticas/estadisticas.service';
import { Respuesta } from '../preguntas/entities/respuesta.entity';
import { ExamenConPreguntasRespuestasDTO } from './dto/response-examen-con-preguntas-previas.dto';
import { GuardarRespuestasParcialesDto } from './dto/guardar-respuestas-parciales.dto';

@Injectable()
export class ExamenesService {
  constructor(
    @InjectRepository(Examen)
    private examenRepository: Repository<Examen>,
    @InjectRepository(ResultadoExamen)
    private resultadoExamenRepository: Repository<ResultadoExamen>,
    @InjectRepository(RespuestaUsuario)
    private respuestaUsuarioRepository: Repository<RespuestaUsuario>,
    private temasService: TemasService,
    private preguntasService: PreguntasService,
    private dataSource: DataSource,
    private estadisticasService: EstadisticasService,
  ) {}

  /**
   * Crea un nuevo examen
   */
  async crearExamen(crearExamenDto: CrearExamenDto, usuarioId: string): Promise<ExamenDto> {
    // Verificar que el tema existe
    const tema = await this.temasService.findOne(crearExamenDto.temaId);

    // Crear el título del examen
    const titulo = `Examen de ${tema.balotario?.nombre || 'Balotario'} - Tema: ${tema.titulo}`;

    // Crear y guardar el examen
    const examen = this.examenRepository.create({
      titulo,
      duracionMinutos: crearExamenDto.duracionMinutos,
      numeroPreguntas: crearExamenDto.numeroPreguntas,
      tema: { id: crearExamenDto.temaId },
      usuario: { id: usuarioId },
      estado: EstadoExamen.PENDIENTE,
    });

    const savedExamen = await this.examenRepository.save(examen);

    // Cargar relaciones
    const examenCompleto = await this.examenRepository.findOne({
      where: { id: savedExamen.id },
      relations: { tema: true, usuario: true },
    });

    if (!examenCompleto) {
      throw new BadRequestException('Error al crear el examen');
    }

    return new ExamenDto(examenCompleto);
  }

  /**
   * Obtiene exámenes con filtros y paginación
   */
  async findAll(
    filterDto: FilterExamenDto,
    usuarioId: string,
  ): Promise<PaginatedResponseDto<ExamenDto>> {
    const { temaId, estado, fechaDesde, fechaHasta, sortBy, order, page, limit } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    const where: FindOptionsWhere<Examen> = {
      usuario: { id: usuarioId },
    };

    if (temaId) {
      where.tema = { id: temaId };
    }

    if (estado) {
      where.estado = estado;
    }

    // Filtros de fecha
    if (fechaDesde && fechaHasta) {
      where.fechaInicio = Between(new Date(fechaDesde), new Date(fechaHasta));
    } else if (fechaDesde) {
      where.fechaInicio = MoreThanOrEqual(new Date(fechaDesde));
    } else if (fechaHasta) {
      where.fechaInicio = LessThanOrEqual(new Date(fechaHasta));
    }

    // Ejecutar la consulta
    const [examenes, totalItems] = await this.examenRepository.findAndCount({
      where,
      relations: { tema: true, usuario: true },
      order: { [sortBy || 'createdAt']: order || 'DESC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = examenes.map((examen) => new ExamenDto(examen));

    // Construir respuesta paginada
    return {
      data: items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Obtiene un examen por su ID
   */
  async findOne(id: string, usuarioId: string): Promise<ExamenDto> {
    const examen = await this.examenRepository.findOne({
      where: { id, usuario: { id: usuarioId } },
      relations: { tema: true, usuario: true },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${id} no encontrado`);
    }

    return new ExamenDto(examen);
  }

  /**
   * Inicia un examen y devuelve las preguntas
   */
  async iniciarExamen(
    iniciarExamenDto: IniciarExamenDto,
    usuarioId: string,
  ): Promise<ExamenConPreguntasDto> {
    const { examenId } = iniciarExamenDto;

    // Obtener el examen
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario: { id: usuarioId } },
      relations: { tema: true, usuario: true },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Verificar que el examen esté en estado PENDIENTE
    if (examen.estado !== EstadoExamen.PENDIENTE) {
      throw new ConflictException(`El examen ya ha sido iniciado o finalizado`);
    }

    // Obtener preguntas aleatorias para el examen
    const preguntas = await this.preguntasService.findRandomForExam(
      examen.tema.id,
      examen.numeroPreguntas,
    );

    // Actualizar el estado del examen a INICIADO y registrar fecha de inicio
    examen.estado = EstadoExamen.INICIADO;
    examen.fechaInicio = new Date();
    // Calcular fecha de finalización según la duración
    examen.fechaFin = DateUtils.addMinutes(examen.fechaInicio, examen.duracionMinutos);

    await this.examenRepository.save(examen);

    return new ExamenConPreguntasDto(examen, preguntas);
  }

  /**
   * Continúa un examen ya iniciado y devuelve las preguntas
   */
  async continuarExamen(
    examenId: string,
    usuarioId: string,
  ): Promise<ExamenConPreguntasRespuestasDTO> {
    // Obtener el examen
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario: { id: usuarioId } },
      relations: { tema: true, usuario: true },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Verificar si el examen ha caducado
    const ahora = new Date();
    if (examen.fechaFin && ahora > examen.fechaFin) {
      examen.estado = EstadoExamen.CADUCADO;
      await this.examenRepository.save(examen);
      throw new ConflictException('El tiempo para completar el examen ha expirado');
    }

    // Verificar que el examen esté en estado INICIADO
    if (examen.estado !== EstadoExamen.INICIADO) {
      throw new ConflictException(
        `No se puede continuar el examen porque está en estado ${examen.estado}`,
      );
    }

    // Buscar respuestas previas si existen
    const resultadoPrevio = await this.resultadoExamenRepository.findOne({
      where: { examen: { id: examenId } },
      relations: { respuestasUsuario: { pregunta: true, respuesta: true } },
    });

    let respuestasUsuario: RespuestaUsuario[] = [];
    let preguntasIds: string[] = [];

    if (resultadoPrevio && resultadoPrevio.respuestasUsuario.length > 0) {
      // Si hay un resultado previo, obtener las respuestas y las preguntas
      respuestasUsuario = resultadoPrevio.respuestasUsuario;
      preguntasIds = respuestasUsuario.map((ru) => ru.pregunta.id);
    } else {
      // Si no hay un resultado previo, obtener las preguntas basadas en exámenes similares
      preguntasIds = await this.obtenerPreguntasDeExamen(examenId);

      if (preguntasIds.length === 0) {
        throw new BadRequestException('No se encontraron preguntas asociadas a este examen');
      }
    }

    // Obtener las preguntas completas
    const preguntas = await this.preguntasService.findPreguntasByIds(preguntasIds);

    // Ahora podemos usar el constructor actualizado que acepta ambos tipos
    return new ExamenConPreguntasRespuestasDTO(examen, preguntas, respuestasUsuario);
  }

  /**
   * Obtiene los IDs de las preguntas asignadas a un examen
   * Este método se utiliza para la funcionalidad de continuar examen
   */
  private async obtenerPreguntasDeExamen(examenId: string): Promise<string[]> {
    // Buscar si hay resultados previos (respuestas guardadas parciales)
    const resultadoPrevio = await this.resultadoExamenRepository.findOne({
      where: { examen: { id: examenId } },
      relations: { respuestasUsuario: { pregunta: true } },
    });

    if (resultadoPrevio && resultadoPrevio.respuestasUsuario.length > 0) {
      // Si hay un resultado previo, obtener las preguntas de ese resultado
      return resultadoPrevio.respuestasUsuario.map((ru) => ru.pregunta.id);
    } else {
      // Si no hay un resultado previo, obtener las preguntas basadas en exámenes similares
      // (mismo tema, mismo número de preguntas)
      const examen = await this.examenRepository.findOne({
        where: { id: examenId },
        relations: { tema: true },
      });

      if (!examen) {
        return [];
      }

      // Buscar exámenes finalizados del mismo tema y con mismo número de preguntas
      const examenesFinalizados = await this.examenRepository.find({
        where: {
          tema: { id: examen.tema.id },
          numeroPreguntas: examen.numeroPreguntas,
          estado: EstadoExamen.FINALIZADO,
        },
        take: 1, // Tomamos solo el más reciente
        order: { fechaFin: 'DESC' },
      });

      if (examenesFinalizados.length > 0) {
        const ultimoExamenFinalizado = examenesFinalizados[0];
        const resultado = await this.resultadoExamenRepository.findOne({
          where: { examen: { id: ultimoExamenFinalizado.id } },
          relations: { respuestasUsuario: { pregunta: true } },
        });

        if (resultado && resultado.respuestasUsuario.length > 0) {
          return resultado.respuestasUsuario.map((ru) => ru.pregunta.id);
        }
      }

      // Si no encontramos preguntas de manera fácil, obtenemos nuevas preguntas aleatorias
      const preguntasAleatorias = await this.preguntasService.findRandomForExam(
        examen.tema.id,
        examen.numeroPreguntas,
      );

      return preguntasAleatorias.map((p) => p.id);
    }
  }

  /**
   * Guarda respuestas parciales de un examen sin finalizarlo
   */
  async guardarRespuestasParciales(
    dto: GuardarRespuestasParcialesDto,
    usuarioId: string,
  ): Promise<{ mensaje: string }> {
    const { examenId, respuestas } = dto;
  
    // Verificar que el examen existe y pertenece al usuario
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario: { id: usuarioId } },
    });
  
    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }
  
    // Verificar que el examen está en estado INICIADO
    if (examen.estado !== EstadoExamen.INICIADO) {
      throw new ConflictException(`El examen no está en estado INICIADO`);
    }
  
    // Verificar que no ha expirado
    const ahora = new Date();
    if (examen.fechaFin && ahora > examen.fechaFin) {
      examen.estado = EstadoExamen.CADUCADO;
      await this.examenRepository.save(examen);
      throw new ConflictException(`El tiempo para completar el examen ha expirado`);
    }
  
    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // Buscar si ya existe un resultado parcial para este examen
      let resultadoExamen = await queryRunner.manager.findOne(ResultadoExamen, {
        where: { examen: { id: examenId }, usuario: { id: usuarioId } },
        relations: { respuestasUsuario: true },
      });
  
      // Si no existe, crear un resultado parcial
      if (!resultadoExamen) {
        // Asegurarnos de tener fechas válidas
        const fechaInicio = examen.fechaInicio || ahora;
        
        // Para fechaFin, usamos una fecha temporal (se actualizará al finalizar el examen)
        // La fijamos a 1 día después para evitar que caduque durante el guardado
        const fechaFinTemporal = new Date(fechaInicio);
        fechaFinTemporal.setDate(fechaFinTemporal.getDate() + 1);
        
        // Calcular duración real en minutos (será actualizado cuando el examen se finalice)
        const duracionReal = Math.max(1, Math.floor((ahora.getTime() - fechaInicio.getTime()) / 60000));
  
        resultadoExamen = queryRunner.manager.create(ResultadoExamen, {
          examen: { id: examenId },
          usuario: { id: usuarioId },
          totalPreguntas: respuestas.length,
          fechaInicio: fechaInicio,
          fechaFin: fechaFinTemporal, // Agregamos fecha de fin temporal
          // Estos campos no están finalizados aún
          preguntasAcertadas: 0,
          puntuacionTotal: 0,
          porcentajeAcierto: 0,
          duracionReal: duracionReal,
        });
  
        resultadoExamen = await queryRunner.manager.save(resultadoExamen);
      } else {
        // Si ya existe, actualizamos la duración real
        const fechaInicio = resultadoExamen.fechaInicio;
        const duracionActual = Math.max(1, Math.floor((ahora.getTime() - fechaInicio.getTime()) / 60000));
        
        // Actualizar solo duracionReal
        resultadoExamen.duracionReal = duracionActual;
        await queryRunner.manager.save(resultadoExamen);
      }
  
      // Eliminar las respuestas existentes para este resultado
      if (resultadoExamen.respuestasUsuario && resultadoExamen.respuestasUsuario.length > 0) {
        await queryRunner.manager.delete(
          RespuestaUsuario,
          resultadoExamen.respuestasUsuario.map(ru => ru.id),
        );
      }
  
      // Guardar las nuevas respuestas
      for (const respuesta of respuestas) {
        const respuestaUsuario = queryRunner.manager.create(RespuestaUsuario, {
          resultadoExamen: { id: resultadoExamen.id },
          pregunta: { id: respuesta.preguntaId },
          respuesta: respuesta.respuestaId ? { id: respuesta.respuestaId } : null,
          // No calculamos si es correcta porque es parcial
          esCorrecta: false, 
          tiempoRespuesta: null,
        });
  
        await queryRunner.manager.save(respuestaUsuario);
      }
  
      // Confirmar transacción
      await queryRunner.commitTransaction();
  
      return {
        mensaje: 'Respuestas guardadas correctamente',
      };
    } catch (error) {
      // Revertir cambios en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  /**
   * Envía las respuestas del examen y devuelve los resultados
   */
  async enviarRespuestas(
    enviarRespuestasDto: EnviarRespuestasDto,
    usuarioId: string,
  ): Promise<ResultadoExamenDto> {
    const { examenId, respuestas } = enviarRespuestasDto;

    // Obtener el examen
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario: { id: usuarioId } },
      relations: { tema: true, usuario: true },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Verificar que el examen esté en estado INICIADO
    if (examen.estado !== EstadoExamen.INICIADO) {
      throw new ConflictException(`El examen no está en estado INICIADO`);
    }

    // Verificar que no se ha excedido el tiempo límite
    const ahora = new Date();

    // Definir tolerancia de 2 segundos
    const TOLERANCIA_MS = 2000;

    if (examen.fechaFin && ahora.getTime() > examen.fechaFin.getTime() + TOLERANCIA_MS) {
      examen.estado = EstadoExamen.CADUCADO;
      await this.examenRepository.save(examen);
      throw new ConflictException(`El tiempo para completar el examen ha expirado`);
    }

    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calcular duración real del examen en minutos
      const duracionReal = DateUtils.getDifferenceInMinutes(examen.fechaInicio!, ahora);

      // Crear registro de resultado del examen
      const resultadoExamen = this.resultadoExamenRepository.create({
        examen: { id: examen.id },
        usuario: { id: usuarioId },
        totalPreguntas: respuestas.length,
        fechaInicio: examen.fechaInicio!,
        fechaFin: ahora,
        duracionReal,
        // Estos valores se actualizarán después
        preguntasAcertadas: 0,
        puntuacionTotal: 0,
        porcentajeAcierto: 0,
      });

      const savedResultado = await queryRunner.manager.save(resultadoExamen);

      // Procesar cada respuesta
      let preguntasAcertadas = 0;

      for (const respuestaDto of respuestas) {
        let respuesta: Respuesta | null = null;
        let esCorrecta = false;

        if (respuestaDto.respuestaId) {
          respuesta = await queryRunner.manager.findOne(Respuesta, {
            where: {
              id: respuestaDto.respuestaId,
              pregunta: { id: respuestaDto.preguntaId },
            },
          });

          if (!respuesta) {
            throw new BadRequestException(
              `Respuesta con ID ${respuestaDto.respuestaId} no encontrada para la pregunta ${respuestaDto.preguntaId}`,
            );
          }

          esCorrecta = respuesta.esCorrecta;
        }

        // Incrementar contador si es correcta
        if (esCorrecta) {
          preguntasAcertadas++;
        }

        // Guardar la respuesta del usuario
        const respuestaUsuario = this.respuestaUsuarioRepository.create({
          resultadoExamen: savedResultado,
          pregunta: { id: respuestaDto.preguntaId },
          respuesta: respuesta ? { id: respuesta.id } : null,
          esCorrecta,
          tiempoRespuesta: null, // No se registra el tiempo por pregunta en este caso
        });

        await queryRunner.manager.save(respuestaUsuario);
      }

      // Calcular puntuación y porcentaje de acierto
      const porcentajeAcierto = (preguntasAcertadas / respuestas.length) * 100;
      const puntuacionTotal = Math.round(porcentajeAcierto); // Puntuación basada en el porcentaje
      // Actualizar resultado con los valores calculados
      savedResultado.preguntasAcertadas = preguntasAcertadas;
      savedResultado.puntuacionTotal = puntuacionTotal;
      savedResultado.porcentajeAcierto = parseFloat(porcentajeAcierto.toFixed(2));

      await queryRunner.manager.save(savedResultado);

      // Actualizar el estado del examen a FINALIZADO
      examen.estado = EstadoExamen.FINALIZADO;
      await queryRunner.manager.save(examen);

      // Actualizar estadísticas
      await this.estadisticasService.actualizarEstadisticasDespuesDeExamen(
        examen.tema.id,
        usuarioId,
        respuestas.length,
        preguntasAcertadas,
        duracionReal,
      );

      // Confirmar transacción
      await queryRunner.commitTransaction();

      // Cargar el resultado completo con relaciones
      const resultadoCompleto = await this.resultadoExamenRepository.findOne({
        where: { id: savedResultado.id },
        relations: {
          examen: {
            tema: true,
          },
          usuario: true,
          respuestasUsuario: {
            pregunta: {
              respuestas: true,
            },
            respuesta: true,
          },
        },
      });

      if (!resultadoCompleto) {
        throw new BadRequestException('Error al procesar las respuestas');
      }

      return new ResultadoExamenDto(resultadoCompleto);
    } catch (error) {
      // Revertir cambios en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  /**
   * Obtiene los resultados de un examen específico
   */
  async getResultadoExamen(examenId: string, usuarioId: string): Promise<ResultadoExamenDto> {
    // Verificar que el examen existe y pertenece al usuario
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario: { id: usuarioId } },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Obtener el resultado del examen con todas sus relaciones
    const resultado = await this.resultadoExamenRepository.findOne({
      where: { examen: { id: examenId }, usuario: { id: usuarioId } },
      relations: {
        examen: {
          tema: true,
        },
        usuario: true,
        respuestasUsuario: {
          pregunta: {
            respuestas: true,
          },
          respuesta: true,
        },
      },
      order: {
        respuestasUsuario: {
          pregunta: {
            texto: 'ASC',
          },
        },
      },
    });

    if (!resultado) {
      throw new NotFoundException(`Resultado para el examen con ID ${examenId} no encontrado`);
    }

    return new ResultadoExamenDto(resultado);
  }

  /**
   * Obtiene todos los resultados de exámenes del usuario con paginación
   */
  async getResultadosExamen(
    filterDto: FilterExamenDto,
    usuarioId: string,
  ): Promise<PaginatedResponseDto<ResultadoExamenDto>> {
    const { temaId, fechaDesde, fechaHasta, sortBy, order, page, limit } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    let where: any = {
      usuario: { id: usuarioId },
    };

    if (temaId) {
      where.examen = {
        tema: { id: temaId },
      };
    }

    // Filtros de fecha
    if (fechaDesde && fechaHasta) {
      where.fechaInicio = Between(new Date(fechaDesde), new Date(fechaHasta));
    } else if (fechaDesde) {
      where.fechaInicio = MoreThanOrEqual(new Date(fechaDesde));
    } else if (fechaHasta) {
      where.fechaInicio = LessThanOrEqual(new Date(fechaHasta));
    }

    // Ejecutar la consulta
    const [resultados, totalItems] = await this.resultadoExamenRepository.findAndCount({
      where,
      relations: {
        examen: {
          tema: true,
        },
        usuario: true,
      },
      order: { [sortBy || 'createdAt']: order || 'DESC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = resultados.map((resultado) => new ResultadoExamenDto(resultado));

    // Construir respuesta paginada
    return {
      data: items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Verifica el estado de un examen (tiempo restante, estado, etc.)
   */
  async verificarEstadoExamen(
    examenId: string,
    usuarioId: string,
  ): Promise<{
    examenId: string;
    estado: EstadoExamen;
    tiempoRestante: number | null;
    tiempoTotal: number;
    porcentajeCompletado: number;
  }> {
    // Obtener el examen
    const examen = await this.examenRepository.findOne({
      where: { id: examenId, usuario: { id: usuarioId } },
    });

    if (!examen) {
      throw new NotFoundException(`Examen con ID ${examenId} no encontrado`);
    }

    // Inicializar valores
    let tiempoRestante: number | null = null;
    let porcentajeCompletado = 0;

    // Calcular tiempo restante si el examen está iniciado
    if (examen.estado === EstadoExamen.INICIADO && examen.fechaInicio && examen.fechaFin) {
      const ahora = new Date();

      // Si ha excedido el tiempo, actualizar estado
      if (ahora > examen.fechaFin) {
        examen.estado = EstadoExamen.CADUCADO;
        await this.examenRepository.save(examen);
      } else {
        // Calcular tiempo restante en segundos
        tiempoRestante = Math.floor((examen.fechaFin.getTime() - ahora.getTime()) / 1000);

        // Calcular porcentaje de tiempo completado
        const tiempoTotal = examen.duracionMinutos * 60; // en segundos
        const tiempoTranscurrido = Math.floor(
          (ahora.getTime() - examen.fechaInicio.getTime()) / 1000,
        );
        porcentajeCompletado = Math.min(100, Math.round((tiempoTranscurrido / tiempoTotal) * 100));
      }
    }

    return {
      examenId: examen.id,
      estado: examen.estado,
      tiempoRestante,
      tiempoTotal: examen.duracionMinutos * 60, // en segundos
      porcentajeCompletado,
    };
  }
}