import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResultadoExamen } from 'src/modules/examenes/entities/resultado-examen.entity';

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  ABOGADO = 'abogado',
}

@Entity('usuarios')
export class Usuario {
  @ApiProperty({ description: 'ID único del usuario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty({ description: 'Apellidos del usuario' })
  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'Rol del usuario', enum: RolUsuario })
  @Column({ 
    type: 'enum', 
    enum: RolUsuario, 
    default: RolUsuario.ABOGADO 
  })
  rol: RolUsuario;

  @ApiProperty({ description: 'Indica si el usuario está activo' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de último inicio de sesión' })
  @Column({ type: 'timestamp', nullable: true })
  ultimoLogin: Date | null;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => ResultadoExamen, (resultadoExamen) => resultadoExamen.usuario)
  resultadosExamenes: ResultadoExamen[];
}