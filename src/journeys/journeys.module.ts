import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneysController } from './journeys.controller';
import { JourneysRepository } from './journeys.repository';
import { JourneysService } from './journeys.service';

@Module({
  imports: [TypeOrmModule.forFeature([JourneysRepository])],
  controllers: [JourneysController],
  providers: [JourneysService],
  exports: [JourneysService, TypeOrmModule],
})
export class JourneysModule {}
