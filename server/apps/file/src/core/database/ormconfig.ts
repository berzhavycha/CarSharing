import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenvConfig();

interface TypeOrmConfigOptions {
  useFactory: (configService: ConfigService) => TypeOrmModuleOptions;
}

export const typeOrmConfigOptions: TypeOrmConfigOptions = {
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres' as const,
      host: configService.get<string>('POSTGRES_HOST') || 'localhost',
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USER') || 'postgres',
      password:
        configService.get<string>('POSTGRES_PASSWORD') || 'postgres_password',
      database: configService.get<string>('POSTGRES_DB') || 'carsharing_test',
      entities: ['dist/apps/file/**/*.entity{.js,.ts}'],
      autoLoadEntities: true,
      migrations: [
        'dist/apps/file/apps/file/src/core/database/migrations/*{.js,.ts}',
      ],
      synchronize: configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
      schema: configService.get<string>('DATABASE_SCHEMA'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
};

export const connectionSource = new DataSource(
  typeOrmConfigOptions.useFactory(new ConfigService()) as DataSourceOptions,
);

export const typeOrmConfig = {
  imports: [ConfigModule],
  useFactory: typeOrmConfigOptions.useFactory,
  inject: [ConfigService],
};
