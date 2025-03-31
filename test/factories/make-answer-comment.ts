import {
  AnswerComment,
  AnswerCommentProps,
} from '../../src/domain/forum/enterprise/entities/answer-comment'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { faker } from '@faker-js/faker';

export function MakeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  const questionComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  )

  return questionComment
}
