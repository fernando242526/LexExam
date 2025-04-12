import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { TemaDto } from './dto/response-tema.dto';
import { CreateTemaDto } from './dto/create-tema.dto';
import { Tema } from './entities/tema.entity';
import { BalotariosService } from '../balotarios/balotarios.service';
import { FilterTemaDto } from './dto/filter-tema.dto';
import { PaginatedResponseDto } from 'src/common/dtos/response.dto';
import { TemaSelectDto } from './dto/select-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';

@Injectable()
export class TemasService {
  constructor(
    @InjectRepository(Tema)
    private temaRepository: Repository<Tema>,
    private balotariosService: BalotariosService,
  ) {}

  /**
   * Crea un nuevo tema
   */
  async create(createTemaDto: CreateTemaDto): Promise<TemaDto> {
    // Verificar que el balotario existe
    await this.balotariosService.findOne(createTemaDto.balotarioId);
    
    // Crear y guardar el nuevo tema
    const tema = this.temaRepository.create(createTemaDto);
    const savedTema = await this.temaRepository.save(tema);
    
    // Cargar la relación con balotario
    const temaWithRelation = await this.temaRepository.findOne({
      where: { id: savedTema.id },
      relations: { balotario: true },
    });
    
    if (!temaWithRelation) {
      throw new BadRequestException('Error al crear el tema');
    }
    
    return new TemaDto(temaWithRelation);
  }

  /**
   * Obtiene todos los temas con filtros y paginación
   */
  async findAll(filterDto: FilterTemaDto): Promise<PaginatedResponseDto<TemaDto>> {
    const { titulo, balotarioId, activo, sortBy, order, page, limit } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    const where: FindOptionsWhere<Tema> = {};

    if (titulo) {
      where.titulo = Like(`%${titulo}%`);
    }

    if (balotarioId) {
      where.balotarioId = balotarioId;
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    // Ejecutar la consulta
    const [temas, totalItems] = await this.temaRepository.findAndCount({
      where,
      relations: { balotario: true },
      order: { [sortBy || 'orden']: order || 'ASC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = temas.map(tema => new TemaDto(tema));

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
   * Obtiene un tema por su ID
   */
  async findOne(id: string): Promise<TemaDto> {
    const tema = await this.temaRepository.findOne({
      where: { id },
      relations: { balotario: true },
    });

    if (!tema) {
      throw new NotFoundException(`Tema con ID ${id} no encontrado`);
    }

    return new TemaDto(tema);
  }

  /**
   * Obtiene temas para select por balotario (solo id, titulo y balotarioId)
   */
  async findAllForSelect(balotarioId?: string): Promise<TemaSelectDto[]> {
    const where: FindOptionsWhere<Tema> = { activo: true };
    
    if (balotarioId) {
      where.balotarioId = balotarioId;
    }
    
    const temas = await this.temaRepository.find({
      where,
      order: { orden: 'ASC' },
    });

    return temas.map(tema => new TemaSelectDto(tema));
  }

  /**
   * Actualiza un tema por su ID
   */
  async update(id: string, updateTemaDto: UpdateTemaDto): Promise<TemaDto> {
    const tema = await this.temaRepository.findOne({
      where: { id },
    });

    if (!tema) {
      throw new NotFoundException(`Tema con ID ${id} no encontrado`);
    }

    // Si se cambia el balotario, verificar que existe
    if (updateTemaDto.balotarioId && updateTemaDto.balotarioId !== tema.balotarioId) {
      await this.balotariosService.findOne(updateTemaDto.balotarioId);
    }

    // Actualizar y guardar
    this.temaRepository.merge(tema, updateTemaDto);
    const updatedTema = await this.temaRepository.save(tema);
    
    // Cargar la relación con balotario
    const temaWithRelation = await this.temaRepository.findOne({
      where: { id: updatedTema.id },
      relations: { balotario: true },
    });
    
    if (!temaWithRelation) {
      throw new BadRequestException('Error al actualizar el tema');
    }
    
    return new TemaDto(temaWithRelation);
  }

  /**
   * Elimina un tema por su ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.temaRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Tema con ID ${id} no encontrado`);
    }
  }
}