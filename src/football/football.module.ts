import { Module } from '@nestjs/common';
import { FootballService } from './football.service';
import { FootballController } from './football.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FootballPrediction, FootBallPredSchema } from './entities/football.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FootballPrediction.name, schema: FootBallPredSchema },
    ]),
  ],
  controllers: [FootballController],
  providers: [FootballService],
})
export class FootballModule {}
