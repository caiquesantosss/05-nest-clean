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
import { EditQuestionController } from './controllers/edit-question-controller'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question-use-case'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer-use-case'
import { FetchQuestionAnswerUseCase } from '@/domain/forum/application/use-cases/fetch-questions-answer-use-case'
import { FetchQuestionsAnswersController } from './controllers/fetch-question-answers.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question-use-case'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment-use-case'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controllert'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer-use-case'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment-use-case'
import { FetchQuestionsCommentsController } from './controllers/fetch-questions-comments.controller'
import { FetchQuestionCommentUseCase } from '@/domain/forum/application/use-cases/fetch-question-comment-use-case'
import { FetchAnswerCommentUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comment-use-case'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comment.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { StorageModule } from '../storage/storage.module'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachments-use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionsAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionsCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCaseUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswerUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentUseCase,
    FetchAnswerCommentUseCase,
    UploadAndCreateAttachmentsUseCase,
  ],
})
export class httpModule {}
