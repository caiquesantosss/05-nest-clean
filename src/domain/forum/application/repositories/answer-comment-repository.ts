import { PaginationParams } from "@/core/repositories/pagenations-params"
import { AnswerComment } from "../../enterprise/entities/answer-comment"

export interface AnswerCommentRepository  {
  create(answerComment: AnswerComment): Promise<void>
   findManyAnswerId(
      answerId: string,
      params: PaginationParams
    ): Promise<AnswerComment[]>
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
}
