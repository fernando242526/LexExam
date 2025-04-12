import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthDto } from './dto/response-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-toekn.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsuarioDto } from '../usuarios/dto/response-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Registra un nuevo usuario
   */
  async register(registerDto: RegisterUserDto): Promise<AuthDto> {
    // Verificar si el correo ya está registrado
    const emailExists = await this.usuarioRepository.findOne({
      where: { email: registerDto.email },
    });

    if (emailExists) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Verificar si el username ya está registrado
    const usernameExists = await this.usuarioRepository.findOne({
      where: { username: registerDto.username },
    });

    if (usernameExists) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear nuevo usuario
    const usuario = this.usuarioRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUsuario = await this.usuarioRepository.save(usuario);

    // Generar tokens
    return this.generateTokens(savedUsuario);
  }

  /**
   * Inicia sesión de un usuario
   */
  async login(loginDto: LoginDto): Promise<AuthDto> {
    // Buscar usuario por username o email
    const usuario = await this.usuarioRepository.findOne({
      where: [
        { username: loginDto.username },
        { email: loginDto.username },
      ],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar fecha de último login
    usuario.ultimoLogin = new Date();
    await this.usuarioRepository.save(usuario);

    // Generar tokens
    return this.generateTokens(usuario);
  }

  /**
   * Actualiza el token de acceso usando un token de actualización
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthDto> {
    // Verificar si el token de actualización es válido
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenDto.refreshToken },
      relations: { usuario: true },
    });

    if (!refreshToken || refreshToken.revocado || new Date() > refreshToken.expiresAt) {
      throw new UnauthorizedException('Token de actualización inválido o expirado');
    }

    // Verificar si el usuario está activo
    if (!refreshToken.usuario.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // Revocar el token actual
    refreshToken.revocado = true;
    await this.refreshTokenRepository.save(refreshToken);

    // Generar nuevos tokens
    return this.generateTokens(refreshToken.usuario);
  }

  /**
   * Cierra la sesión de un usuario
   */
  async logout(refreshToken: string): Promise<{ success: boolean }> {
    // Buscar y revocar el token de actualización
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (token) {
      token.revocado = true;
      await this.refreshTokenRepository.save(token);
    }

    return { success: true };
  }

  /**
   * Cambia la contraseña de un usuario
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ success: boolean }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, usuario.password);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Crear hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    usuario.password = hashedPassword;

    await this.usuarioRepository.save(usuario);

    // Revocar todos los tokens de actualización del usuario
    await this.refreshTokenRepository.update(
      { usuarioId: userId, revocado: false },
      { revocado: true }
    );

    return { success: true };
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  async getProfile(userId: string): Promise<UsuarioDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return new UsuarioDto(usuario);
  }

  /**
   * Genera tokens de acceso y actualización
   */
  private async generateTokens(usuario: Usuario): Promise<AuthDto> {
    // Crear payload para el token
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      email: usuario.email,
      rol: usuario.rol,
    };

    // Generar token de acceso
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });

    // Generar token de actualización
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') || this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    // Calcular fecha de expiración
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const expiresAt = new Date();
    if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn.slice(0, -1)));
    } else if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn.slice(0, -1)));
    } else if (expiresIn.endsWith('m')) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn.slice(0, -1)));
    } else if (expiresIn.endsWith('s')) {
      expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(expiresIn.slice(0, -1)));
    }

    // Guardar token de actualización en la base de datos
    await this.refreshTokenRepository.save({
      token: refreshToken,
      expiresAt,
      usuarioId: usuario.id,
      revocado: false,
    });

    return {
      accessToken,
      refreshToken,
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      nombreCompleto: `${usuario.nombre} ${usuario.apellidos}`,
      rol: usuario.rol,
      expiresAt,
    };
  }

  /**
   * Valida un usuario por su ID (usado por la estrategia JWT)
   */
  async validateUser(userId: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { id: userId, activo: true },
    });
  }
}