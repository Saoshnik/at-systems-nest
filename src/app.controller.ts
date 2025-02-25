import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('config')
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('')
    generateAdSet(@Query() query: Record<string, string | string[]>) {
        const queryParams = Object.entries(query).flatMap(([key, value]) =>
            Array.isArray(value) ? value.map((v) => ({key, value: v})) : [{key, value}]
        );

        // console.log(queryParams);

        return this.appService.generateAdSet(queryParams);
    }
}
