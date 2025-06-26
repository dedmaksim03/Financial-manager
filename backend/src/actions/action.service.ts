import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Action } from "./action.entity";
import { DeleteResult, In, Repository } from "typeorm";
import { User } from "src/users/user.entity";
import { ActionDto } from "./dtos/action.dto";
import { CategoryService } from "src/categories/category.service";

@Injectable()
export class ActionService {
    private readonly logger = new Logger(ActionService.name)
    constructor(
        @InjectRepository(Action) private actionRepository: Repository<Action>,
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

    async createAction (actionDto: ActionDto): Promise<Action | null> {

        let category = await this.categoryService.getById(actionDto.category_id)

        if (!category) {
            return null
        }

        const newAction = this.actionRepository.create({
            type: actionDto.type,
            message: actionDto.message,
            sum: actionDto.sum,
            date: actionDto.date,
            category: category
        });

        return this.actionRepository.save(newAction)
    }    
    
    async deleteAction (id: number): Promise<DeleteResult> {
        return this.actionRepository.delete(id)
    }     
}