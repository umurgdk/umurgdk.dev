import Head from 'next/head'
import Image from 'next/image'
import FeaturedArticles from './components/FeaturedArticles/FeaturedArticles'
import ArticlesSection from './components/ArticlesSection/ArticlesSection'

export default function Home() {
  return <>
    <FeaturedArticles />
    <ArticlesSection />
  </>
}
