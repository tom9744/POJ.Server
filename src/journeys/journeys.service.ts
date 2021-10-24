import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJourneyDto } from './dtos/create-journey.dto';
import { UpdateJourneyDto } from './dtos/update-journey.dto';
import { Journey } from './entities/journey.entity';
import { JourneysRepository } from './journeys.repository';

@Injectable()
export class JourneysService {
  constructor(
    @InjectRepository(JourneysRepository)
    private journeysRepository: JourneysRepository,
  ) {}

  async create(createJourneyDto: CreateJourneyDto): Promise<Journey> {
    try {
      return await this.journeysRepository.createJourney(createJourneyDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Journey[]> {
    const foundJourneys: Journey[] = await this.journeysRepository.find();

    return foundJourneys;
  }

  async findOneById(id: number): Promise<Journey> {
    const foundJourney = this.journeysRepository.findOne(id);

    if (!foundJourney) {
      throw new NotFoundException(`Could not find a journey with ID ${id}`);
    }

    return foundJourney;
  }

  async update(id: number, updateJourneyDto: UpdateJourneyDto): Promise<void> {
    const targetJourney = this.findOneById(id);

    await this.journeysRepository.save({
      ...targetJourney,
      ...updateJourneyDto,
    });
  }

  async delete(id: number): Promise<void> {
    const deletionResult = await this.journeysRepository.delete(id);

    if (deletionResult.affected < 1) {
      throw new NotFoundException(`Can't find a journey with ID ${id}`);
    }
  }
}
