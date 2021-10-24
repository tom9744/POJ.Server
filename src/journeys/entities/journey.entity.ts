import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Photo } from 'src/photos/entities/photo.entity';

@Entity()
export class Journey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany((type) => Photo, (photo) => photo.journey, { eager: true })
  photos: Photo[];
}
