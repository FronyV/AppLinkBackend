import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Link, User } from './entities';


@Module({
  controllers: [LinksController],
  providers: [LinksService],
  imports: [
    TypeOrmModule.forFeature([ Link, User ])
  ]
})
export class LinksModule {}
