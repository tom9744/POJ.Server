import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateJourneyDto } from './dtos/create-journey.dto';
import { UpdateJourneyDto } from './dtos/update-journey.dto';
import { Journey } from './entities/journey.entity';
import { JourneysService } from './journeys.service';

@Controller('journeys')
export class JourneysController {
  constructor(private journeyService: JourneysService) {}

  @Post()
  async createJourney(@Body() createJourneyDto: CreateJourneyDto) {
    try {
      return await this.journeyService.create(createJourneyDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  readAllJourneys(): Promise<Journey[]> {
    return this.journeyService.findAll();
  }

  @Get('/:id')
  readJourneyById(@Param('id') id: number): Promise<Journey> {
    return this.journeyService.findOneById(id);
  }

  @Patch('/:id')
  updateJourney(
    @Param('id') id: number,
    @Body() updateJourneyDto: UpdateJourneyDto,
  ) {
    this.journeyService.update(id, updateJourneyDto);
  }

  @Delete('/:id')
  deleteJourney(@Param('id') id: number) {
    this.journeyService.delete(id);
  }
}
