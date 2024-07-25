import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Get()
  findAll(@Query('from') from: Date, @Query('to') to: Date) {
    return this.footballService.findAll(from, to);
  }
}
