import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tema } from '../../temas/entities/tema.entity';
import { Respuesta } from './respuesta.entity';
import { RespuestaUsuario } from 'src/modules/examenes/entities/respuesta-usuario.entity';


export enum NivelDificultad {
  FACIL = 'facil',
  MEDIO = 'medio',
  DIFICIL = 'dificil'
}

@Entity('preguntas')
export class Pregunta {
  @ApiProperty({ description: 'ID único de la pregunta' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Texto de la pregunta' })
  @Column({ type: 'text' })
  texto: string;

  @ApiProperty({ description: 'Explicación adicional de la pregunta', required: false })
  @Column({ type: 'text', nullable: true })
  explicacion: string | null;

  @ApiProperty({ description: 'Nivel de dificultad', enum: NivelDificultad })
  @Column({ 
    type: 'enum', 
    enum: NivelDificultad, 
    default: NivelDificultad.MEDIO 
  })
  nivelDificultad: NivelDificultad;

  @ApiProperty({ description: 'Indica si la pregunta está activa' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Tema, (tema) => tema.preguntas, { nullable: false })
  @JoinColumn({ name: 'tema_id' })
  tema: Tema;

  @Column({ type: 'uuid' })
  temaId: string;

  @OneToMany(() => Respuesta, (respuesta) => respuesta.pregunta, { cascade: true })
  respuestas: Respuesta[];

  @OneToMany(() => RespuestaUsuario, (respuestaUsuario) => respuestaUsuario.pregunta)
  respuestasUsuarios: RespuestaUsuario[];
}