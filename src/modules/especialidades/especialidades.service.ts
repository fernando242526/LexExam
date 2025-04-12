import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { CreateEspecialidadDto } from './dto/create-especialidade.dto';
import { Especialidad } from './entities/especialidade.entity';
import { EspecialidadDto } from './dto/response-especialidad.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { FilterEspecialidadDto } from './dto/filter-especialidad.dto';
import { EspecialidadSelectDto } from './dto/select-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidade.dto';


@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private especialidadRepository: Repository<Especialidad>,
  ) {}

  /**
   * Crea una nueva especialidad
   */
  async create(createEspecialidadDto: CreateEspecialidadDto): Promise<EspecialidadDto> {
    // Verificar si ya existe una especialidad con el mismo nombre
    const existingEspecialidad = await this.especialidadRepository.findOne({
      where: { nombre: createEspecialidadDto.nombre },
    });

    if (existingEspecialidad) {
      throw new ConflictException(`Ya existe una especialidad con el nombre: ${createEspecialidadDto.nombre}`);
    }

    // Crear y guardar la nueva especialidad
    const especialidad = this.especialidadRepository.create(createEspecialidadDto);
    const savedEspecialidad = await this.especialidadRepository.save(especialidad);
    
    return new EspecialidadDto(savedEspecialidad);
  }

  /**
   * Obtiene todas las especialidades con filtros y paginación
   */
  async findAll(filterDto: FilterEspecialidadDto): Promise<PaginatedResponseDto<EspecialidadDto>> {
    const { nombre, activo, sortBy, order, page, limit } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    const where: FindOptionsWhere<Especialidad> = {};

    if (nombre) {
      where.nombre = Like(`%${nombre}%`);
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    // Ejecutar la consulta
    const [especialidades, totalItems] = await this.especialidadRepository.findAndCount({
      where,
      order: { [sortBy || 'nombre']: order || 'ASC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = especialidades.map(especialidad => new EspecialidadDto(especialidad));

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
   * Obtiene una especialidad por su ID
   */
  async findOne(id: string): Promise<EspecialidadDto> {
    const especialidad = await this.especialidadRepository.findOne({
      where: { id },
    });

    if (!especialidad) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }

    return new EspecialidadDto(especialidad);
  }

  /**
   * Obtiene todas las especialidades para select (solo id y nombre)
   */
  async findAllForSelect(): Promise<EspecialidadSelectDto[]> {
    const especialidades = await this.especialidadRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });

    return especialidades.map(especialidad => new EspecialidadSelectDto(especialidad));
  }

  /**
   * Actualiza una especialidad por su ID
   */
  async update(id: string, updateEspecialidadDto: UpdateEspecialidadDto): Promise<EspecialidadDto> {
    const especialidad = await this.especialidadRepository.findOne({
      where: { id },
    });

    if (!especialidad) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }

    // Verificar que no exista otra especialidad con el mismo nombre
    if (updateEspecialidadDto.nombre && updateEspecialidadDto.nombre !== especialidad.nombre) {
      const existingEspecialidad = await this.especialidadRepository.findOne({
        where: { nombre: updateEspecialidadDto.nombre },
      });

      if (existingEspecialidad) {
        throw new ConflictException(`Ya existe una especialidad con el nombre: ${updateEspecialidadDto.nombre}`);
      }
    }

    // Actualizar y guardar
    this.especialidadRepository.merge(especialidad, updateEspecialidadDto);
    const updatedEspecialidad = await this.especialidadRepository.save(especialidad);
    
    return new EspecialidadDto(updatedEspecialidad);
  }

  /**
   * Elimina una especialidad por su ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.especialidadRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }
  }
}