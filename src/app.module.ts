import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { EspecialidadesModule } from './modules/especialidades/especialidades.module';
import { BalotariosModule } from './modules/balotarios/balotarios.module';
import { TemasModule } from './modules/temas/temas.module';
import { PreguntasModule } from './modules/preguntas/preguntas.module';
import { ExamenesModule } from './modules/examenes/examenes.module';
import { EstadisticasModule } from './modules/estadisticas/estadisticas.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.database.host,
        port: configService.database.port,
        username: configService.database.username,
        password: configService.database.password,
        database: configService.database.database,
        schema: configService.database.schema,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.database.synchronize, // Solo en desarrollo
        logging: configService.database.logging,
      }),
    }),
    UsuariosModule,
    AuthModule,
    EspecialidadesModule,
    BalotariosModule,
    TemasModule,
    PreguntasModule,
    ExamenesModule,
    EstadisticasModule,
  ],
})
export class AppModule {}