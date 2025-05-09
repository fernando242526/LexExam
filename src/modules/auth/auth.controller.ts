import { Controller, Post, Body, Get, UseGuards, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/response-auth.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-toekn.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsuarioDto } from '../usuarios/dto/response-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Registra un nuevo usuario en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    type: AuthDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El correo o nombre de usuario ya existe',
  })
  register(@Body() registerDto: RegisterUserDto): Promise<AuthDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Inicia sesión con credenciales de usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso',
    type: AuthDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  login(@Body() loginDto: LoginDto): Promise<AuthDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Actualizar token',
    description: 'Actualiza el token de acceso usando un token de actualización',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token actualizado exitosamente',
    type: AuthDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de actualización inválido o expirado',
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión', description: 'Cierra la sesión del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sesión cerrada exitosamente',
  })
  logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ success: boolean }> {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description: 'Cambia la contraseña del usuario actual',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña cambiada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'La contraseña actual es incorrecta',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
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
    type: UsuarioDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  getProfile(@GetUser('id') userId: string): Promise<UsuarioDto> {
    return this.authService.getProfile(userId);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar restablecimiento de contraseña',
    description: 'Envía un correo con un enlace para restablecer la contraseña',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Solicitud procesada',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example:
            'Si el correo existe en nuestra base de datos, se ha enviado un enlace de restablecimiento.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description: 'Restablece la contraseña utilizando un token válido',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña restablecida',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Contraseña restablecida exitosamente.' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o token expirado',
  })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('verify-reset-token/:token')
  @ApiOperation({
    summary: 'Verificar token de restablecimiento',
    description: 'Verifica si un token de restablecimiento es válido',
  })
  @ApiParam({ name: 'token', description: 'Token de restablecimiento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado de la verificación',
    schema: {
      properties: {
        valid: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token válido.' },
      },
    },
  })
  verifyResetToken(@Param('token') token: string): Promise<{ valid: boolean; message: string }> {
    return this.authService.verifyResetToken(token);
  }
}