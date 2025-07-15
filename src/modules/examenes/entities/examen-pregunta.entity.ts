import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Examen } from './examen.entity';
import { Pregunta } from '../../preguntas/entities/pregunta.entity';

@Entity('examenes_preguntas')
export class ExamenPregunta {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'int' })
    orden: number;
  
    @Column({ name: 'examen_id' })
    examenId: string;
  
    @Column({ name: 'pregunta_id' })
    preguntaId: string;
  
    @ManyToOne(() => Examen, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'examen_id' })
    examen: Examen;
  
    @ManyToOne(() => Pregunta, { nullable: false })
    @JoinColumn({ name: 'pregunta_id' })
    pregunta: Pregunta;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    constructor(examenId: string, preguntaId: string, orden: number) {
        this.examenId = examenId;
        this.preguntaId = preguntaId;
        this.orden = orden;
    }
}