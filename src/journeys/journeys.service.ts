import { Injectable, NotFoundException } from '@nestjs/common';

import { v1 as uuid } from 'uuid';

import { CreateJourneyDto } from './DTOs/create-journey.dto';
import { UpdateJourneyDto } from './DTOs/update-journey.dto';
import { Journey } from './types/journey.interface';

@Injectable()
export class JourneysService {
  private readonly journeys: Journey[] = [];

  create(createJourneyDto: CreateJourneyDto): void {
    const newJourney: Journey = {
      id: uuid(), // Temporal ID, will be replaced to DB-Generated ID.
      ...createJourneyDto,
    };

    this.journeys.push(newJourney); // Create Instance
  }

  findAll(): Journey[] {
    return this.journeys;
  }

  findOneById(id: string): Journey {
    const foundJourney = this.journeys.find((journey) => journey.id === id);

    if (!foundJourney) {
      throw new NotFoundException();
    }

    return foundJourney;
  }

  update(id: string, updateJourneyDto: UpdateJourneyDto): void {
    const targetIndex = this.journeys.findIndex((journey) => journey.id === id);

    if (targetIndex < 0) {
      throw new NotFoundException();
    }

    const originalJourney = this.journeys[targetIndex];
    const updatedJourney = {
      ...originalJourney,
      ...updateJourneyDto,
    };

    this.journeys[targetIndex] = updatedJourney; // Update Instance
  }

  delete(id: string) {
    this.journeys.filter((journey) => journey.id !== id); // Delete Instance
  }
}
