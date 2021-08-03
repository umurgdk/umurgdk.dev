import { getAllArticles, getArticle, Post } from "lib/getAllPosts";
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import * as contentComponents from 'components/PostContentComponents'

const components = {
    ...contentComponents
}

export default function Article({ post, source }: { post: Post, source: any }) {
    return <article className="pt-6 bg-gray-100 border-t text-gray-700 text-lg">
        <div className="page-inset">
            <MDXRemote {...source} components={components} />
        </div>
    </article>
}

export async function getStaticPaths() {
    const posts = getAllArticles()
    const paths = posts.map(post => ({ params: { slug: post.slug } }))
    return { paths, fallback: false }
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string } }) {
    const article = getArticle(slug)
    const source = await serialize(article.content)
    return { props: { post: article, source } }
}