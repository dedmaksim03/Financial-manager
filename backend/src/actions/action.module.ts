import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ActionsController } from './action.controller';
import { ActionService } from './action.service';
import { CategoryService } from 'src/categories/category.service';
import { CategoryModule } from 'src/categories/category.module';

@Module({
    imports: [
      DatabaseModule,
      forwardRef(() => CategoryModule)
    ],
    controllers: [ActionsController],
    providers: [ActionService, CategoryService]
})
export class ActionModule {}