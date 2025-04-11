import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Pregunta } from './pregunta.entity';
import { RespuestaUsuario } from 'src/modules/examenes/entities/respuesta-usuario.entity';

@Entity('respuestas')
export class Respuesta {
  @ApiProperty({ description: 'ID único de la respuesta' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Texto de la respuesta' })
  @Column({ type: 'text' })
  texto: string;

  @ApiProperty({ description: 'Indica si la respuesta es correcta' })
  @Column({ type: 'boolean', default: false })
  esCorrecta: boolean;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del registro' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Pregunta, (pregunta) => pregunta.respuestas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Pregunta;

  @Column({ type: 'uuid' })
  preguntaId: string;

  @OneToMany(() => RespuestaUsuario, (respuestaUsuario) => respuestaUsuario.respuesta)
  respuestasUsuarios: RespuestaUsuario[];
}