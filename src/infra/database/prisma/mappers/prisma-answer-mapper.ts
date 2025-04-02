import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        questionId: new UniqueEntityId(raw.questionId).toString(),
        authorId: new UniqueEntityId(raw.authorId).toString(),
        createdAt: raw.createdAt,
        updatedAt: raw.updateAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.AuthorId.toString(),
      questionId: answer.QuestionId.toString(),
      content: answer.Content,
      createdAt: answer.CreatedAt,
      updateAt: answer.UpdateAt,
    }
  }
}
