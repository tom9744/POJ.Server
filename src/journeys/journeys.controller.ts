import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateJourneyDto } from './DTOs/create-journey.dto';
import { UpdateJourneyDto } from './DTOs/update-journey.dto';
import { JourneysService } from './journeys.service';
import { Journey } from './types/journey.interface';

@Controller('journeys')
export class JourneysController {
  constructor(private journeyService: JourneysService) {}

  @Post()
  createJourney(@Body() createJourneyDto: CreateJourneyDto) {
    this.journeyService.create(createJourneyDto);
  }

  @Get()
  readAllJourneys(): Journey[] {
    return this.journeyService.findAll();
  }

  @Get('/:id')
  readJourneyById(@Param('id') id: string): Journey {
    return this.journeyService.findOneById(id);
  }

  @Patch('/:id')
  updateJourney(
    @Param('id') id: string,
    @Body() updateJourneyDto: UpdateJourneyDto,
  ) {
    this.journeyService.update(id, updateJourneyDto);
  }

  @Delete('/:id')
  deleteJourney(@Param('id') id: string) {
    this.journeyService.delete(id);
  }
}
