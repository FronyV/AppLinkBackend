import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LinksModule } from './links/links.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './appLink.db',
      autoLoadEntities: true,
      synchronize: true
    }),
    LinksModule,
    UsersModule,
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
