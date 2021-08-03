import fs from 'fs'
import { join, basename } from 'path'
import matter from 'gray-matter'

export type Post = {
    slug: string,
    meta: { [key: string]: any }
    content: string
}

const POSTS_PATH = 'pages/posts/'
const ARTICLES_PATH = 'pages/articles/'

export function getAllArticles(): Post[] {
    return getPostFilePaths(ARTICLES_PATH).map(getPost)
}

export function getAllPosts(): Post[] {
    return getPostFilePaths(POSTS_PATH).map(getPost)
}

export function getArticle(slug: string): Post {
    return getPost(join(ARTICLES_PATH, slug + '.mdx'))
}

function getPostFilePaths(basePath: string): string[] {
    return fs.readdirSync(basePath)
        .filter(path => /\.mdx?$/.test(path))
        .map(path => join(basePath, path))
}

function getPost(filePath: string): Post {
    const slug = basename(filePath).replace(/\.mdx?$/, '')
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContents)

    const post = { slug, meta: data, content }
    return post
}