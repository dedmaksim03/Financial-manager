import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Category } from "./category.entity";
import { DeleteResult, Repository } from "typeorm";
import { Action } from "src/actions/action.entity";
import { ActionService } from "src/actions/action.service";
import { CategoryResponseDto } from "./dtos/category.response.dto";

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name)
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @Inject(forwardRef(() => ActionService))
        private readonly actionService: ActionService
    ) {}

    async getAllCategoriesByUser (user: User): Promise<Category[]> {
        let categories = this.categoryRepository.find({where: {user: user}})
        return categories
    }
    async getCategoriesByUser (user: User, dateFrom: Date, dateTo: Date): Promise<CategoryResponseDto[]> {
        
        let actions: Action[] = []
        const categoriesSum = new Map<number, number>();

        let categories = await this.getAllCategoriesByUser(user)
        this.logger.log(`Actions in range: ${dateFrom}, ${dateTo}`)

        actions = await this.actionService.getActionsByUser(user, dateFrom, dateTo)

        actions.forEach(action => {
                if (categoriesSum.has(action.category.id)){
                    let currentSum = categoriesSum.get(action.category.id) || 0
                    categoriesSum.set(action.category.id, currentSum + action.sum)                  
                }
                else {
                    categoriesSum.set(action.category.id, action.sum)     
                }
            }
        )

        return categories.map((category) => new CategoryResponseDto(category.name, category.color, categoriesSum.get(category.id) || 0))

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
    
    async getById (id: number): Promise<Category|null> {
        return this.categoryRepository.findOne({where: {id: id}})
    }
}