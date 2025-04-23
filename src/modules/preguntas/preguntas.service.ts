import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, DataSource, In } from 'typeorm';
import { NivelDificultad, Pregunta } from './entities/pregunta.entity';
import { Respuesta } from './entities/respuesta.entity';
import { TemasService } from '../temas/temas.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { PreguntaDto } from './dto/response-pregunta.dto';
import { FilterPreguntaDto } from './dto/filter-pregunta.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { PreguntaExamenDto } from './dto/response-pregunta-examen.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { CreatePreguntasMasivoDto } from './dto/create-preguntas-masivas.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Injectable()
export class PreguntasService {
  constructor(
    @InjectRepository(Pregunta)
    private preguntaRepository: Repository<Pregunta>,
    @InjectRepository(Respuesta)
    private respuestaRepository: Repository<Respuesta>,
    private temasService: TemasService,
    private dataSource: DataSource,
  ) {}

  /**
  * Crea una nueva pregunta con sus respuestas
  */
  // async create(createPreguntaDto: CreatePreguntaDto): Promise<PreguntaDto> {
  //   // Verificar que al menos una respuesta sea marcada como correcta
  //   const tieneRespuestaCorrecta = createPreguntaDto.respuestas.some((r) => r.esCorrecta);

  //   if (!tieneRespuestaCorrecta) {
  //     throw new BadRequestException('Debe haber al menos una respuesta correcta');
  //   }

  //   // Iniciar transacción para guardar pregunta y respuestas
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     // Crear y guardar la nueva pregunta
  //     const { respuestas, ...preguntaData } = createPreguntaDto;

  //     const pregunta = this.preguntaRepository.create(preguntaData);
  //     const savedPregunta = await queryRunner.manager.save(pregunta);

  //     // Crear y guardar las respuestas
  //     const respuestasEntities = respuestas.map((respuestaDto) =>
  //       this.respuestaRepository.create({
  //         ...respuestaDto,
  //         pregunta: savedPregunta,
  //       }),
  //     );

  //     await queryRunner.manager.save(Respuesta, respuestasEntities);

  //     // Confirmar transacción
  //     await queryRunner.commitTransaction();

  //     // Cargar la pregunta con sus relaciones
  //     const preguntaCompleta = await this.preguntaRepository.findOne({
  //       where: { id: savedPregunta.id },
  //       relations: { tema: true, respuestas: true },
  //     });

  //     if (!preguntaCompleta) {
  //       throw new BadRequestException('Error al crear la pregunta');
  //     }

  //     return new PreguntaDto(preguntaCompleta);
  //   } catch (error) {
  //     // Revertir cambios en caso de error
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     // Liberar el queryRunner
  //     await queryRunner.release();
  //   }
  // }

  /**
   * Crea múltiples preguntas para un tema específico
   */
  async createMasivo(createMasivoDto: CreatePreguntasMasivoDto): Promise<{
    total: number;
    creadas: number;
    ignoradas: number;
    detallesIgnorados: string[];
    mensaje: string;
  }> {
    // Validación previa para asegurarse de que el tema existe
    await this.temasService.findOne(createMasivoDto.temaId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let preguntasCreadas = 0;
      const totalPreguntas = createMasivoDto.preguntas.length;
      const detallesIgnorados: string[] = [];

      for (const [index, preguntaDto] of createMasivoDto.preguntas.entries()) {
        // Validar que tenga al menos dos respuestas
        if (!preguntaDto.respuestas || preguntaDto.respuestas.length < 2) {
          detallesIgnorados.push(
            `Pregunta ${index + 1} ignorada: debe tener al menos 2 respuestas.`,
          );
          continue;
        }

        // Validar que al menos una respuesta sea correcta
        const tieneRespuestaCorrecta = preguntaDto.respuestas.some((r) => r.esCorrecta);
        if (!tieneRespuestaCorrecta) {
          detallesIgnorados.push(`Pregunta ${index + 1} ignorada: no tiene respuesta correcta.`);
          continue;
        }

        // Si no se especifica, se asigna dificultad media por defecto
        const nivelDificultadValue = preguntaDto.nivelDificultad ?? NivelDificultad.MEDIO;

        // Crear la entidad Pregunta
        const pregunta = this.preguntaRepository.create({
          texto: preguntaDto.texto,
          explicacion: preguntaDto.explicacion,
          nivelDificultad: nivelDificultadValue,
          activo: preguntaDto.activo ?? true,
          tema: { id: createMasivoDto.temaId },
        });

        const savedPregunta = await queryRunner.manager.save(pregunta);

        // Crear las respuestas
        const respuestasEntities = preguntaDto.respuestas.map((respuestaDto) =>
          this.respuestaRepository.create({
            texto: respuestaDto.texto,
            esCorrecta: respuestaDto.esCorrecta,
            pregunta: savedPregunta,
          }),
        );

        await queryRunner.manager.save(Respuesta, respuestasEntities);
        preguntasCreadas++;
      }

      await queryRunner.commitTransaction();

      return {
        total: totalPreguntas,
        creadas: preguntasCreadas,
        ignoradas: totalPreguntas - preguntasCreadas,
        detallesIgnorados,
        mensaje: `Se crearon ${preguntasCreadas} de ${totalPreguntas} preguntas.`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene todas las preguntas con filtros y paginación
   */
  async findAll(filterDto: FilterPreguntaDto): Promise<PaginatedResponseDto<PreguntaDto>> {
    const { texto, temaId, nivelDificultad, activo, sortBy, order, page, limit } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    const where: FindOptionsWhere<Pregunta> = {};

    if (texto) {
      where.texto = Like(`%${texto}%`);
    }

    if (temaId) {
      where.tema = { id: temaId };
    }

    if (nivelDificultad) {
      where.nivelDificultad = nivelDificultad;
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    // Ejecutar la consulta
    const [preguntas, totalItems] = await this.preguntaRepository.findAndCount({
      where,
      relations: { tema: true, respuestas: true },
      order: { [sortBy || 'createdAt']: order || 'DESC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = preguntas.map((pregunta) => new PreguntaDto(pregunta));

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
   * Obtiene una pregunta por su ID
   */
  async findOne(id: string): Promise<PreguntaDto> {
    const pregunta = await this.preguntaRepository.findOne({
      where: { id },
      relations: { tema: true, respuestas: true },
    });

    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    return new PreguntaDto(pregunta);
  }

  /**
   * Obtiene preguntas aleatorias para un examen
   */
  async findRandomForExam(temaId: string, cantidad: number): Promise<PreguntaExamenDto[]> {
    // Verificar que el tema existe
    await this.temasService.findOne(temaId);

    // Paso 1: Obtener IDs de preguntas aleatorias
    const rawIds = await this.preguntaRepository
      .createQueryBuilder('pregunta')
      .select('pregunta.id', 'id')
      .where('pregunta.tema.id = :temaId', { temaId })
      .andWhere('pregunta.activo = true')
      .orderBy('RANDOM()')
      .limit(cantidad)
      .getRawMany();

    const ids = rawIds.map((row) => row.id);

    if (ids.length === 0) {
      throw new BadRequestException(`No hay preguntas disponibles para el tema con ID ${temaId}`);
    }

    if (ids.length < cantidad) {
      console.warn(
        `Se solicitaron ${cantidad} preguntas, pero solo hay ${ids.length} disponibles para el tema ${temaId}`,
      );
    }

    // Paso 2: Obtener preguntas completas con respuestas
    const preguntas = await this.preguntaRepository.find({
      where: { id: In(ids) },
      relations: ['respuestas'],
    });

    return preguntas.map((pregunta) => new PreguntaExamenDto(pregunta));
  }

  /**
   * Actualiza una pregunta por su ID
   */
  // async update(id: string, updatePreguntaDto: UpdatePreguntaDto): Promise<PreguntaDto> {
  //   // Verificar que la pregunta existe
  //   const pregunta = await this.preguntaRepository.findOne({
  //     where: { id },
  //     relations: { respuestas: true },
  //   });

  //   if (!pregunta) {
  //     throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
  //   }

  //   // Si se cambia el tema, verificar que existe
  //   if (updatePreguntaDto.temaId) {
  //     await this.temasService.findOne(updatePreguntaDto.temaId);
  //   }

  //   // Iniciar transacción
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     // Actualizar la pregunta
  //     const { respuestas, ...preguntaData } = updatePreguntaDto;

  //     if (Object.keys(preguntaData).length > 0) {
  //       this.preguntaRepository.merge(pregunta, preguntaData);
  //       await queryRunner.manager.save(pregunta);
  //     }

  //     // Si se proporcionan respuestas, actualizarlas
  //     if (respuestas && respuestas.length > 0) {
  //       // Verificar que al menos una respuesta sea marcada como correcta
  //       const tieneRespuestaCorrecta = respuestas.some((r) => r.esCorrecta);

  //       if (!tieneRespuestaCorrecta) {
  //         throw new BadRequestException('Debe haber al menos una respuesta correcta');
  //       }

  //       // Respuestas a actualizar (tienen id)
  //       const respuestasExistentes = respuestas.filter((r) => r.id);

  //       // Respuestas a crear (no tienen id)
  //       const respuestasNuevas = respuestas
  //         .filter((r) => !r.id)
  //         .map((r) =>
  //           this.respuestaRepository.create({
  //             ...r,
  //             pregunta: { id },
  //           }),
  //         );

  //       // IDs de respuestas a mantener
  //       const idsRespuestasAMantener = respuestasExistentes.map((r) => r.id);

  //       // Eliminar respuestas que ya no están en la lista
  //       if (idsRespuestasAMantener.length > 0) {
  //         await queryRunner.manager
  //           .createQueryBuilder()
  //           .delete()
  //           .from(Respuesta)
  //           .where('pregunta.id = :preguntaId AND id NOT IN (:...ids)', {
  //             preguntaId: id,
  //             ids: idsRespuestasAMantener,
  //           })
  //           .execute();
  //       } else if (respuestasNuevas.length > 0) {
  //         // Si solo hay respuestas nuevas, eliminar todas las anteriores
  //         await queryRunner.manager
  //           .createQueryBuilder()
  //           .delete()
  //           .from(Respuesta)
  //           .where('pregunta.id = :preguntaId', { preguntaId: id })
  //           .execute();
  //       }

  //       // Actualizar respuestas existentes
  //       for (const respuestaData of respuestasExistentes) {
  //         const respuesta = await queryRunner.manager.findOne(Respuesta, {
  //           where: { id: respuestaData.id, pregunta: { id } },
  //         });

  //         if (respuesta) {
  //           this.respuestaRepository.merge(respuesta, respuestaData);
  //           await queryRunner.manager.save(respuesta);
  //         }
  //       }

  //       // Crear nuevas respuestas
  //       if (respuestasNuevas.length > 0) {
  //         await queryRunner.manager.save(respuestasNuevas);
  //       }
  //     }

  //     // Confirmar transacción
  //     await queryRunner.commitTransaction();

  //     // Cargar la pregunta actualizada con sus relaciones
  //     const preguntaActualizada = await this.preguntaRepository.findOne({
  //       where: { id },
  //       relations: { tema: true, respuestas: true },
  //     });

  //     if (!preguntaActualizada) {
  //       throw new BadRequestException('Error al actualizar la pregunta');
  //     }

  //     return new PreguntaDto(preguntaActualizada);
  //   } catch (error) {
  //     // Revertir cambios en caso de error
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     // Liberar el queryRunner
  //     await queryRunner.release();
  //   }
  // }

  /**
   * Obtiene preguntas por sus IDs
   * Método utilizado para continuar un examen
   */
  async findPreguntasByIds(ids: string[]): Promise<PreguntaExamenDto[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    
    // Obtener preguntas completas con respuestas
    const preguntas = await this.preguntaRepository.find({
      where: { id: In(ids), activo: true },
      relations: ['respuestas'],
    });

    if (preguntas.length === 0) {
      throw new BadRequestException(`No se encontraron preguntas activas con los IDs proporcionados`);
    }

    // Si faltan algunas preguntas, mostrar warning
    if (preguntas.length < ids.length) {
      const encontrados = preguntas.map(p => p.id);
      const faltantes = ids.filter(id => !encontrados.includes(id));
      console.warn(`No se encontraron todas las preguntas solicitadas. Faltan: ${faltantes.join(', ')}`);
    }

    return preguntas.map((pregunta) => new PreguntaExamenDto(pregunta));
  }

  /**
   * Elimina una pregunta por su ID
   */
  async remove(id: string): Promise<void> {
    // Verificar que la pregunta existe
    const pregunta = await this.preguntaRepository.findOne({
      where: { id },
    });

    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    // Eliminar la pregunta (las respuestas se eliminarán en cascada)
    await this.preguntaRepository.remove(pregunta);
  }
}
