import { UniqueEntityId } from "@/core/entities/unique-entity";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/values-object/slug";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create({
            title: raw.title, 
            content: raw.content, 
            authorId: new UniqueEntityId(raw.authorId),
            bestAnswerId: raw.bestAnswerId 
                ? new UniqueEntityId(raw.bestAnswerId) 
                : null,
            slug: Slug.create(raw.slug),
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt 

        }, new UniqueEntityId(raw.id))
    }

    static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(), 
            authorId: question.AuthorId.toString(),
            bestAnswerId: question.BestAnswerId?.toString(),
            title: question.Title,
            content: question.Content,
            slug: question.slug.value,
            createdAt: question.CreatedAt,
            updateAt: question.UpdateAt
        }
    }
}