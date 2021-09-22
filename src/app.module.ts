import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JourneysModule } from './journeys/journeys.module';

@Module({
  imports: [JourneysModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
