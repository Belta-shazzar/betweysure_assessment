import { Controller, Get, Query } from '@nestjs/common';
import { FootballService } from './football.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) {}

  @Get()
  @ApiOperation({ summary: 'Get saved predicted data betminers' })
  @ApiResponse({ status: 200, description: 'list of saved data' })
  @ApiQuery({
    name: 'from',
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'to', type: String, description: 'End date (YYYY-MM-DD)' })
  findAll(@Query('from') from: Date, @Query('to') to: Date) {
    return this.footballService.findAll(from, to);
  }
}
