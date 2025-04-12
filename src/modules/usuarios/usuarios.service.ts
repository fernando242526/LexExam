import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolUsuario, Usuario } from "./entities/usuario.entity";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { PaginatedResponseDto } from "src/common/dtos/response.dto";
import { UsuarioDto } from "./dto/response-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Obtiene todos los usuarios con paginación
   */
  async findAll(
    paginationDto: PaginationDto,
    search?: string,
    rol?: RolUsuario,
    activo?: boolean,
  ): Promise<PaginatedResponseDto<UsuarioDto>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    // Construir where según los filtros
    const where: FindOptionsWhere<Usuario> = {};

    if (search) {
      where.username = Like(`%${search}%`);
    }

    if (rol) {
      where.rol = rol;
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    // Ejecutar la consulta
    const [usuarios, totalItems] = await this.usuarioRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // Mapear a DTOs
    const items = usuarios.map(usuario => new UsuarioDto(usuario));

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
   * Obtiene un usuario por su ID
   */
  async findOne(id: string): Promise<UsuarioDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return new UsuarioDto(usuario);
  }

  /**
   * Actualiza un usuario por su ID
   */
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Actualizar y guardar
    this.usuarioRepository.merge(usuario, updateUsuarioDto);
    const updatedUsuario = await this.usuarioRepository.save(usuario);
    
    return new UsuarioDto(updatedUsuario);
  }

  /**
   * Activa o desactiva un usuario por su ID
   */
  async toggleActivo(id: string, activo: boolean): Promise<UsuarioDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    usuario.activo = activo;
    const updatedUsuario = await this.usuarioRepository.save(usuario);
    
    return new UsuarioDto(updatedUsuario);
  }

  /**
   * Cambia el rol de un usuario por su ID
   */
  async changeRol(id: string, rol: RolUsuario): Promise<UsuarioDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    usuario.rol = rol;
    const updatedUsuario = await this.usuarioRepository.save(usuario);
    
    return new UsuarioDto(updatedUsuario);
  }
}