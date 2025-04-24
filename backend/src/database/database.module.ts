import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
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
                entities: [User],
                synchronize: false, // Включите только в разработке
            }),
            inject: [ConfigService]

        }),
        TypeOrmModule.forFeature([User])
    ],
    exports: [TypeOrmModule]
})

export class DatabaseModule {}