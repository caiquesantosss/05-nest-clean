import { Answer } from "@/domain/forum/enterprise/entities/answer"

export class AnswerPresenter {
    static toHttp(answer: Answer) {
        return {
            id: answer.id.toString(), 
            content: answer.Content,
            createdAt: answer.CreatedAt, 
            updatedAt: answer.UpdateAt
        }
    }
}