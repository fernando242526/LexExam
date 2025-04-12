import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Balotario } from './entities/balotario.entity';
import { EspecialidadesService } from '../especialidades/especialidades.service';
import { CreateBalotarioDto } from './dto/create-balotario.dto';
import { BalotarioDto } from './dto/response-balotari.dto';
import { FilterBalotarioDto } from './dto/filter-balotario.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { BalotarioSelectDto } from './dto/select-balotario.dto';
import { UpdateBalotarioDto } from './dto/update-balotario.dto';


@Injectable()
export class BalotariosService {
  constructor(
    @InjectRepository(Balotario)
    private balotarioRepository: Repository<Balotario>,
    private especialidadesService: EspecialidadesService,
  ) {}

  /**
   * Crea un nuevo balotario
   */
  async create(createBalotarioDto: CreateBalotarioDto): Promise<BalotarioDto> {
    // Verificar que la especialidad existe
    await this.especialidadesService.findOne(createBalotarioDto.especialidadId);
    
    // Crear y guardar el nuevo balotario
    const balotario = this.balotarioRepository.create(createBalotarioDto);
    const savedBalotario = await this.balotarioRepository.save(balotario);
    
    // Cargar la relación con especialidad
    const balotarioWithRelation = await this.balotarioRepository.findOne({
      where: { id: savedBalotario.id },
      relations: { especialidad: true },
    });
    
    if (!balotarioWithRelation) {
      throw new BadRequestException('Error al crear el balotario');
    }
    
    return new BalotarioDto(balotarioWithRelation);
  }

  /**
   * Obtiene todos los balotarios con filtros y paginación
   */
  async findAll(filterDto: FilterBalotarioDto): Promise<PaginatedResponseDto<BalotarioDto>> {
    const { nombre, institucion, anio, especialidadId, activo, sortBy, order, page, limit } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    const where: FindOptionsWhere<Balotario> = {};

    if (nombre) {
      where.nombre = Like(`%${nombre}%`);
    }

    if (institucion) {
      where.institucion = Like(`%${institucion}%`);
    }

    if (anio !== undefined) {
      where.anio = anio;
    }

    if (especialidadId) {
      where.especialidadId = especialidadId;
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    // Ejecutar la consulta
    const [balotarios, totalItems] = await this.balotarioRepository.findAndCount({
      where,
      relations: { especialidad: true },
      order: { [sortBy || 'nombre']: order || 'ASC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = balotarios.map(balotario => new BalotarioDto(balotario));

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
   * Obtiene un balotario por su ID
   */
  async findOne(id: string): Promise<BalotarioDto> {
    const balotario = await this.balotarioRepository.findOne({
      where: { id },
      relations: { especialidad: true },
    });

    if (!balotario) {
      throw new NotFoundException(`Balotario con ID ${id} no encontrado`);
    }

    return new BalotarioDto(balotario);
  }

  /**
   * Obtiene balotarios para select por especialidad (solo id y nombre)
   */
  async findAllForSelect(especialidadId?: string): Promise<BalotarioSelectDto[]> {
    const where: FindOptionsWhere<Balotario> = { activo: true };
    
    if (especialidadId) {
      where.especialidadId = especialidadId;
    }
    
    const balotarios = await this.balotarioRepository.find({
      where,
      order: { nombre: 'ASC' },
    });

    return balotarios.map(balotario => new BalotarioSelectDto(balotario));
  }

  /**
   * Actualiza un balotario por su ID
   */
  async update(id: string, updateBalotarioDto: UpdateBalotarioDto): Promise<BalotarioDto> {
    const balotario = await this.balotarioRepository.findOne({
      where: { id },
    });

    if (!balotario) {
      throw new NotFoundException(`Balotario con ID ${id} no encontrado`);
    }

    // Si se cambia la especialidad, verificar que existe
    if (updateBalotarioDto.especialidadId && updateBalotarioDto.especialidadId !== balotario.especialidadId) {
      await this.especialidadesService.findOne(updateBalotarioDto.especialidadId);
    }

    // Actualizar y guardar
    this.balotarioRepository.merge(balotario, updateBalotarioDto);
    const updatedBalotario = await this.balotarioRepository.save(balotario);
    
    // Cargar la relación con especialidad
    const balotarioWithRelation = await this.balotarioRepository.findOne({
      where: { id: updatedBalotario.id },
      relations: { especialidad: true },
    });
    
    if (!balotarioWithRelation) {
      throw new BadRequestException('Error al actualizar el balotario');
    }
    
    return new BalotarioDto(balotarioWithRelation);
  }

  /**
   * Elimina un balotario por su ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.balotarioRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Balotario con ID ${id} no encontrado`);
    }
  }
}