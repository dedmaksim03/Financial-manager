import { Controller, Logger, UseGuards, Request, Get, Post, Res, Body, BadRequestException, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/jwt/jwt.auth.guard";
import { Response, Request as R } from 'express'
import { CategoryDto } from "./dtos/category.response.dto";
import { CategoryService } from "./category.service";
import { CategoryRequestDto } from "./dtos/category.request.dto";

@Controller('api/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    private readonly logger = new Logger(CategoriesController.name)

    constructor (
        private readonly categoryService: CategoryService
    ){}

    @Get('get')
    async getAllCategoriesForUser (@Request() req): Promise<CategoryDto[]> {
        let categories = await this.categoryService.getAllCategoriesByUser(req.user)
        return categories.map((category) => new CategoryDto(category.name, category.color, 0))
    }

    @Post('create')
    async createCategory (@Request() req, @Body() categoryRequestDto: CategoryRequestDto) {
        let saveResult = await this.categoryService.createCategory(
            categoryRequestDto.name, categoryRequestDto.color, req.user
        )

        if (!saveResult) {
            this.logger.log('Error while creating category')
            return new BadRequestException()
        }
        return 
    }

    @Delete('delete')
    async deleteCategory (@Request() req, @Body() categoryRequestDto: CategoryRequestDto) {
        if (!categoryRequestDto.id) {
            this.logger.log('Error while delete category')
            return new BadRequestException()
        }
        let deleteResult = await this.categoryService.deleteCategory(categoryRequestDto.id)
        return 
    }

}
