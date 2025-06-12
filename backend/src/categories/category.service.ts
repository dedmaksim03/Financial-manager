import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Category } from "./category.entity";
import { DeleteResult, Repository } from "typeorm";
import { CategoryRequestDto } from "./dtos/category.request.dto";

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name)
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
    ) {}

    async getAllCategoriesByUser (user: User): Promise<Category[]> {
        let categories = this.categoryRepository.find({where: {user: user}})
        return categories
    }

    async createCategory (categoryName: string, categoryColor: string, user: User): Promise<Category> {

        const newCategory = this.categoryRepository.create({
            name: categoryName,
            color: categoryColor,
            user: user
        });

        return this.categoryRepository.save(newCategory)
    } 
    
    async deleteCategory (id: number): Promise<DeleteResult> {
        return this.categoryRepository.delete(id)
    }        
}