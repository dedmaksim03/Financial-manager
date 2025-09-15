import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Category } from "./category.entity";
import { DataSource, DeleteResult, Repository, UpdateResult } from "typeorm";
import { Action } from "src/actions/action.entity";
import { ActionService } from "src/actions/action.service";
import { CategoryResponseDto } from "./dtos/category.response.dto";
import { CategoryRequestDto } from "./dtos/category.request.dto";

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name)
    constructor(
        private dataSource: DataSource,
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

        return categories.map((category) => new CategoryResponseDto(category.id, category.name, category.color, categoriesSum.get(category.id) || 0, category.type))

    }

    async createCategory (categoryName: string, categoryColor: string, type: string, user: User): Promise<Category> {

        const newCategory = this.categoryRepository.create({
            name: categoryName,
            color: categoryColor,
            type: type,            
            user: user
        });

        return this.categoryRepository.save(newCategory)
    } 

    async editCategory (categoryRequestDto: CategoryRequestDto): Promise<Category> {

        const category = await this.categoryRepository.findOne({where: {id: categoryRequestDto.id}})

        if (!category)
            throw new BadRequestException("Категория с таким id не найдена")

        category.name = categoryRequestDto.name
        category.color = categoryRequestDto.color
        category.type = categoryRequestDto.type
        

        return this.categoryRepository.save(category)
    } 
    
    async deleteCategory (id: number, forceDelete=false): Promise<DeleteResult> {
        let actionsByCategory = await this.actionService.getActionsByCategory(id)
        if (actionsByCategory.length != 0 && !forceDelete) {
            throw new ConflictException(`Категория ${id} не может быть удалена из-за наличия зависимых объектов`);
        }
        
        let category = await this.categoryRepository.findOne({where: {id: id}})

        if (category){
            return this.dataSource.transaction(async (manager) => {
                await manager.getRepository(Action).delete({category: category})
                return manager.getRepository(Category).delete(id)
            })            
        }
        else {
            throw new NotFoundException(`Категория ${id} не найдена`);
        }
    }     
    
    async getById (id: number): Promise<Category|null> {
        return this.categoryRepository.findOne({where: {id: id}})
    }
}