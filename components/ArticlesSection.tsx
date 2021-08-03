import Image from 'next/image'
import Link from 'next/link'
import SearchField from './SearchField'
import ImageContent from '../public/article-images/custom-nstextfield/mini-thumbnail@2x.png'
import Tag from './Tag'
import { Post } from '../lib/getAllPosts'

interface Props {
    posts: Post[]
}

export default function ArticlesSection({ posts }: Props) {
    return <div className="page-inset bg-gradient-to-b from-gray-100 to-gray-50 border-t border-gray-300">
        <div className="flex justify-between items-baseline">
            <h1 className="text-inset text-base font-bold text-gray-400">RECENT ARTICLES</h1>
            <SearchField placeholder="Search articles..." />
        </div>
        <ArticleList posts={posts} />
    </div>
}

function ArticleList({ posts }: { posts: Post[] }) {
    console.log(posts)
    return <div className="elevated-container mt-8 divide-y divide-gray-200">
        {posts.map(post => <ArticleItem key={post.slug} post={post} />)}
    </div>
}

function ArticleItem({ post }: { post: Post }) {
    return <div className="image-inset flex bg-white">
        <SmallImage />
        <div className="flex-col text-inset">
            <p className="block text-base text-gray-700 font-medium leading-4">
                <Link href={`/articles/${post.slug}`}>{post.meta['title']}</Link>
            </p>
            <span className="block text-sm text-gray-500 leading-6">{post.meta['listingDescription']}</span>
            <div className="flex space-x-4 leading-4">
                {post.meta['tags'].map((tag: string) => <Tag name={tag} key={tag} />)}
            </div>
        </div>
    </div>
}

function SmallImage() {
    return <div className="w-14 h-14 relative">
        <div className="border border-black border-opacity-10 z-10 absolute w-full h-full"></div>
        <Image src={ImageContent} />
    </div>
}