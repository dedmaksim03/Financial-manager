import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesController } from './category.controller';
import { CategoryService } from './category.service';
import { ActionService } from 'src/actions/action.service';
import { ActionModule } from 'src/actions/action.module';

@Module({
    imports: [
      DatabaseModule,
      forwardRef(() => ActionModule)
    ],
    controllers: [CategoriesController],
    providers: [CategoryService, ActionService]
})
export class CategoryModule {}
