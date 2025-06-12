import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    imports: [
      DatabaseModule
    ],
    controllers: [CategoriesController],
    providers: [CategoryService]
})
export class CategoryModule {}
