import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class FootballPrediction extends mongoose.Document {
  @Prop()
  matchId: string;

  @Prop()
  competition: string;

  @Prop()
  country: string;

  @Prop()
  homeTeam: string;

  @Prop()
  awayTeam: string;

  @Prop()
  dateOfMatch: string;

  @Prop()
  status: string;

  @Prop()
  predictedWinner: string;

  @Prop()
  predictedGoals: string;

  @Prop()
  predictedBTTS: string;

  @Prop()
  actualWinner: string;

  @Prop()
  actualGoalsCategory: string;

  @Prop()
  actualBTTS: string;

  @Prop()
  winnerCorrect: boolean;

  @Prop()
  goalsCorrect: boolean;

  @Prop()
  bttsCorrect: boolean;
}

export const FootBallPredSchema = SchemaFactory.createForClass(FootballPrediction);
