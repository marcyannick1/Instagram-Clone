import { User, Likes, Comments } from "@prisma/client";

export interface IPost{
    id: number
    user: User
    date: Date
    media: IPostMedia[]
    description: string
    likes: Likes[]
    comments: Comments[]
}

export interface IPostMedia{
    type: string
    url: string
}