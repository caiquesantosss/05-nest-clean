import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { title } from 'process'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Answer [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionCommentFactory: QuestionCommentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    await app.init()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.MakePrismaQuestion({
        authorId: user.id
    })

    const QuestionComment = await questionCommentFactory.MakePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id
    })

    const questionCommentId = QuestionComment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(204)
    const CommentOnDatabase = await prisma.comment.findUnique({
        where: {
            id: questionCommentId
        }
    })

    expect(CommentOnDatabase).toBeNull()
  })
})
