import { Comment } from "@/domain/forum/enterprise/entities/comment";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class CommentsPresenter {
    static toHttp(comments: Comment<any>) {
        return {
            id: comments.id.toString(), 
            content: comments.content, 
            createdAt: comments.createdAt, 
            updatedAt: comments.updatedAt
        }
    }
}