import { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionPresenter {
    static toHttp(question: Question) {
        return {
            id: question.id.toString(), 
            title: question.Title,
            slug: question.slug.value, 
            bestAnswerId: question.BestAnswerId?.toString(), 
            createdAt: question.CreatedAt, 
            updatedAt: question.UpdateAt
        }
    }
}