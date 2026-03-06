import { makeAutoObservable } from "mobx";

export interface Blog {
    id: number,
    authorName: string,
    content: string,
    title: string,
    createdAt: string
    email: string
}

export class BlogState {

    title: string = ""
    content: string = ""
    image?: File = undefined;
    loading: boolean = false
    message: string = ""
    blogs: Blog [] = []
    blogDetail: Blog | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setBlogs(blogs: Blog[]) {
        this.blogs = blogs;
    }

    setTitle(title: string) {
        this.title = title;
    }

    setContent(content: string) {
        this.content = content;
    }

    setField<K extends keyof BlogState>(key: K, value: BlogState[K]) {
        (this as any)[key] = value;
    }

    setImage(file?: File) {
        this.image = file;
    }

    setMessage(message: string) {
        this.message = message;
    }

    setBlogDetail(blog: Blog) {
        this.blogDetail = blog;
    }

    reset() {
        this.title = "";
        this.content = "";
        this.image = undefined;
        this.message = "";
    }
}