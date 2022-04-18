import { Journey } from 'src/journeys/entities/journey.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalPath: string;

  @Column()
  thumbnailPath: string;

  @Column()
  modifyDate: Date;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @ManyToOne((type) => Journey, (journey) => journey.photos, {
    eager: false,
    onDelete: 'CASCADE',
  })
  journey: Journey;
}
