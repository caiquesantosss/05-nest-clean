import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case'
import { FetchRecentQuestionUseCaseUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { AuthenticateStudentsUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCaseUseCase,
    RegisterStudentUseCase, 
    AuthenticateStudentsUseCase,
    GetQuestionBySlugUseCase
  ],
})
export class httpModule {}
