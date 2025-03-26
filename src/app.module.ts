import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      validate: (env) => envSchema.parse(env)
    })
  ],
  controllers: [CreateAccountController],
  providers: [
    PrismaService],
})
export class AppModule {}
