import { Controller, Logger, UseGuards, Request, Get, Post, Res, Body, BadRequestException, Delete, Query, Param } from "@nestjs/common";
import { JwtAuthGuard } from "src/jwt/jwt.auth.guard";
import { Response, Request as R } from 'express'
import { CategoryResponseDto } from "./dtos/category.response.dto";
import { CategoryService } from "./category.service";
import { CategoryRequestDto } from "./dtos/category.request.dto";
import { CategoryDatefilterDto } from "./dtos/category.datefilter.dto";
import { ActionService } from "src/actions/action.service";
import { Action } from "src/actions/action.entity";
import { Category } from "./category.entity";

@Controller('api/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    private readonly logger = new Logger(CategoriesController.name)

    constructor (
        private readonly categoryService: CategoryService
    ){}

    @Get('get')
    async getAllCategoriesForUser (@Request() req, @Query() categoryDatefilterDto: CategoryDatefilterDto): Promise<CategoryResponseDto[]> {

        let categories: CategoryResponseDto[] | Category[]

        if (categoryDatefilterDto?.dateFrom && categoryDatefilterDto?.dateTo) {
            categories = await this.categoryService.getCategoriesByUser(req.user, categoryDatefilterDto?.dateFrom, categoryDatefilterDto?.dateTo)
            return categories
        }
        else {
            categories = await this.categoryService.getAllCategoriesByUser(req.user)
            return categories.map((category) => new CategoryResponseDto(category.id, category.name, category.color, 0, category.type))
        }
        
    }

    @Post('create')
    async createCategory (@Request() req, @Body() categoryRequestDto: CategoryRequestDto) {
        let saveResult = await this.categoryService.createCategory(
            categoryRequestDto.name, categoryRequestDto.color, categoryRequestDto.type, req.user
        )

        if (!saveResult) {
            this.logger.log('Error while creating category')
            return new BadRequestException()
        }
        return 
    }

    @Delete(':id')
    async deleteCategory (@Request() req, @Param('id') categoryId: number, @Query('forceDelete') forceDelete=false) {
        if (!categoryId) {
            this.logger.log('Error while delete category')
            return new BadRequestException()
        }
        let deleteResult = await this.categoryService.deleteCategory(categoryId, forceDelete)
        return 
    }

}
