import {
  QuestionComment,
  QuestionCommentProps,
} from '../../src/domain/forum/enterprise/entities/question-comment'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { faker } from '@faker-js/faker';

export function MakeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  )

  return questionComment
}
