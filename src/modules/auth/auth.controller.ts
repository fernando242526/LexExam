import { Controller, Post, Body, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/response-auth.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-toekn.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsuarioDto } from '../usuarios/dto/response-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario', description: 'Registra un nuevo usuario en el sistema' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Usuario registrado exitosamente', 
    type: AuthDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El correo o nombre de usuario ya existe' 
  })
  register(@Body() registerDto: RegisterUserDto): Promise<AuthDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Inicia sesión con credenciales de usuario' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Inicio de sesión exitoso', 
    type: AuthDto 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciales inválidas' 
  })
  login(@Body() loginDto: LoginDto): Promise<AuthDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Actualizar token', description: 'Actualiza el token de acceso usando un token de actualización' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Token actualizado exitosamente', 
    type: AuthDto 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token de actualización inválido o expirado' 
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión', description: 'Cierra la sesión del usuario' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Sesión cerrada exitosamente' 
  })
  logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ success: boolean }> {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña', description: 'Cambia la contraseña del usuario actual' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contraseña cambiada exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'La contraseña actual es incorrecta' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil', description: 'Obtiene el perfil del usuario actual' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Perfil obtenido exitosamente', 
    type: UsuarioDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'No autorizado' 
  })
  getProfile(@GetUser('id') userId: string): Promise<UsuarioDto> {
    return this.authService.getProfile(userId);
  }
}