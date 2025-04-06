import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { title } from 'process'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete Answer Comment [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    await app.init()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.MakePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.MakePrismaQuestion({
        authorId: user.id
    })

    const answer = await answerFactory.MakePrismaAnswer({
        authorId: user.id.toString(), 
        questionId: question.id.toString()
    })

    const answerComment = await answerCommentFactory.MakePrismaAnswerComment({
        authorId: user.id, 
        answerId: answer.id
    })

    const answerCommentId = answerComment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answer/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(204)
    const CommentOnDatabase = await prisma.comment.findUnique({
        where: {
            id: answerCommentId
        }
    })

    expect(CommentOnDatabase).toBeNull()
  })
})
