import { User, Likes, Comments } from "@prisma/client";

export interface IPost{
    id: number
    user: User
    date: Date
    media: string
    description: string
    likes: Likes
    comments: Comments
}