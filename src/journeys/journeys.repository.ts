import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateJourneyDto } from './dtos/create-journey.dto';
import { Journey } from './entities/journey.entity';

@EntityRepository(Journey)
export class JourneysRepository extends Repository<Journey> {
  private handleError(error: any): void {
    switch (error.code) {
      case '22007':
        throw new BadRequestException('Invalid data type has been passed.');
      case '23505':
        throw new ConflictException('Duplicated journey title.');
      default:
        throw new InternalServerErrorException();
    }
  }

  async createJourney(createJourneyDto: CreateJourneyDto): Promise<Journey> {
    const newJourney = this.create({
      ...createJourneyDto,
    });

    try {
      await this.save(newJourney);
    } catch (error) {
      this.handleError(error);
    }

    return newJourney;
  }
}
