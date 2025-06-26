import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Action } from "src/actions/action.entity";
import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService): Promise<TypeOrmModule> => ({
                type: configService.get<string>('DB_TYPE'),// || 'postgres',
                host: configService.get<string>('DB_HOST'),// || 'localhost',
                port: configService.get<string>('DB_PORT'),// || 5432,
                username: configService.get<string>('DB_USERNAME'),// || 'postgres',
                password: configService.get<string>('DB_PASSWORD'),// || '12345',
                database: configService.get<string>('DB_DATABASE'),// || 'financial_manager_database',
                entities: [User, Category, Action],
                synchronize: false, // Включите только в разработке
            }),
            inject: [ConfigService]

        }),
        TypeOrmModule.forFeature([User, Category, Action])
    ],
    exports: [TypeOrmModule]
})

export class DatabaseModule {}