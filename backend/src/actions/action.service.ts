import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Action } from "./action.entity";
import { Between, DeleteResult, Equal, In, Repository } from "typeorm";
import { User } from "src/users/user.entity";
import { ActionDto } from "./dtos/action.dto";
import { CategoryService } from "src/categories/category.service";
import { Category } from "src/categories/category.entity";

@Injectable()
export class ActionService {
    private readonly logger = new Logger(ActionService.name)
    constructor(
        @InjectRepository(Action) private actionRepository: Repository<Action>,
        @Inject(forwardRef(() => CategoryService))
        private readonly categoryService: CategoryService
    ) {}

    async getAllActionsByUser (user: User): Promise<Action[]> {
        let userCategories = await this.categoryService.getAllCategoriesByUser(user)
        let categoryIds = userCategories.map(cat => cat.id)
        let actions = this.actionRepository.find({
            where: {category: In(categoryIds)},
            relations: ['category']
        })
        return actions
    }

    async getActionsByUser (user: User, dateFrom: Date, dateTo: Date): Promise<Action[]> {
        let userCategories = await this.categoryService.getAllCategoriesByUser(user)
        let categoryIds = userCategories.map(cat => cat.id)
        this.logger.log(`${dateFrom}, ${dateTo}`)
        let actions = this.actionRepository.find({
            where: {
                category: In(categoryIds),
                date: Between(dateFrom.toString(), dateTo.toString())
            },
            relations: ['category']
        })
        return actions
    }

    async getActionsByCategory (categoryId: number, dateFrom?: Date, dateTo?: Date): Promise<Action[]> {

        if (!dateFrom || !dateTo) {
            return this.actionRepository.find({
                where: {
                    category: Equal(categoryId)
                }
            })
        }

        else {
            return this.actionRepository.find({
                where: {
                    category: Equal(categoryId),
                    date: Between(dateFrom.toString(), dateTo.toString())
                }
            })            
        }
    }

    async createAction (actionDto: ActionDto): Promise<Action | null> {

        let category = await this.categoryService.getById(actionDto.category_id)

        this.logger.log(`actionDto: ${actionDto.date}`)

        if (!category) {
            return null
        }

        const newAction = this.actionRepository.create({
            message: actionDto.message,
            sum: actionDto.sum,
            date: actionDto.date,
            category: category
        });

        this.logger.log(`newAction: ${newAction.date}`)

        return this.actionRepository.save(newAction)
    }    

    async editAction (actionDto: ActionDto): Promise<Action> {
        let category = await this.categoryService.getById(actionDto.category_id)
        if (!category) {
            throw new BadRequestException("Операция с такой категорией не найдена")
        }
        let action = await this.actionRepository.findOne({where: {id: actionDto.id}})
        if (!action) {
            throw new BadRequestException("Операция не найдена")
        }

        action.date = actionDto.date 
        action.message = actionDto.message
        action.sum = actionDto.sum 
        action.category = category

        return this.actionRepository.save(action)
    }    
    
    async deleteAction (id: number): Promise<DeleteResult> {
        return this.actionRepository.delete(id)
    }     
}