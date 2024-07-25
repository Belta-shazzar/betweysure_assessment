import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { FootballPrediction } from './entities/football.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FootballService {
  constructor(
    @InjectModel(FootballPrediction.name)
    private readonly footBallPredModel: Model<FootballPrediction>,
  ) {}

  async findAll(from: Date, to: Date) {
    try {
      const betminerURL = `https://betminer.p.rapidapi.com/bm/predictions/list/${from}/${to}`;
      const response = await axios.get(betminerURL, {
        headers: {
          'x-rapidapi-key':
            '8e53d28072mshf555dab65276779p13a9d1jsnb81978ce250e',
          'x-rapidapi-host': 'betminer.p.rapidapi.com',
        },
      });

      const fetchedData = response.data;

      const predictedResults: Record<string, any>[] =
        this.enhancePredictionsAndCompareWithActualResults(fetchedData);

      const savedPredictions =
        await this.footBallPredModel.insertMany(predictedResults);

      return savedPredictions;
    } catch (error) {
      Logger.error(error);
      return error.response;
    }
  }

  enhancePredictionsAndCompareWithActualResults(fetchedData: any) {
    const predictedResults: Record<string, any>[] = [];

    fetchedData.forEach((data: any) => {
      let predictedWinner: string;
      let predictedGoals: string;
      let predictedBTTS: string;

      const homeWinProb = parseFloat(data.home_win);
      const awayWinProb = parseFloat(data.away_win);
      const drawProb = parseFloat(data.draw);

      if (homeWinProb > awayWinProb && homeWinProb > drawProb) {
        predictedWinner = 'Home';
      } else if (awayWinProb > homeWinProb && awayWinProb > drawProb) {
        predictedWinner = 'Away';
      } else {
        predictedWinner = 'Draw';
      }

      const over15Prob = parseFloat(data.over15goals);
      const over25Prob = parseFloat(data.over25goals);
      const over35Prob = parseFloat(data.over35goals);

      predictedGoals =
        over35Prob > 50
          ? 'Over 3.5'
          : over25Prob > 50
            ? 'Over 2.5'
            : over15Prob > 50
              ? 'Over 1.5'
              : 'Under 1.5';

      const bttsProb = parseFloat(data.both_teams_to_score);
      predictedBTTS = bttsProb > 50 ? 'Yes' : 'No';

      const actualWinner =
        data.home_goals > data.away_goals
          ? 'Home'
          : data.away_goals > data.home_goals
            ? 'Away'
            : 'Draw';
      const actualGoals = data.home_goals + data.away_goals;
      const actualGoalsCategory =
        actualGoals > 3
          ? 'Over 3.5'
          : actualGoals > 2
            ? 'Over 2.5'
            : actualGoals > 1
              ? 'Over 1.5'
              : 'Under 1.5';
      const actualBTTS =
        data.home_goals > 0 && data.away_goals > 0 ? 'Yes' : 'No';

      const winnerCorrect = predictedWinner === actualWinner;
      const goalsCorrect = predictedGoals === actualGoalsCategory;
      const bttsCorrect = predictedBTTS === actualBTTS;

      predictedResults.push({
        matchId: data.id,
        competition: data.competition_full,
        country: data.country,
        dateOfMatch: data.date,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        status: data.status,
        predictedWinner,
        predictedGoals,
        predictedBTTS,
        actualWinner,
        actualGoalsCategory,
        actualBTTS,
        winnerCorrect,
        goalsCorrect,
        bttsCorrect,
      });
    });

    return predictedResults;
  }
}
