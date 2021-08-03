import Head from 'next/head'
import Image from 'next/image'
import FeaturedArticles from '../components/FeaturedArticles/FeaturedArticles'
import ArticlesSection from '../components/ArticlesSection'
import { GetStaticProps } from 'next'
import { getAllArticles, getAllPosts, Post } from '../lib/getAllPosts'

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  return <>
    <FeaturedArticles />
    <ArticlesSection posts={posts} />
  </>
}


export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllArticles()
  return { props: { posts } }
};