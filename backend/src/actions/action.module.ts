import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ActionsController } from './action.controller';
import { ActionService } from './action.service';
import { CategoryService } from 'src/categories/category.service';

@Module({
    imports: [
      DatabaseModule
    ],
    controllers: [ActionsController],
    providers: [ActionService, CategoryService]
})
export class ActionModule {}