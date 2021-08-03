import Article from './FeaturedArticle'
export default function FeaturedArticles() {
    return <div className="page-inset flex space-x-20">
        <div className="flex-1">
            <Article />
        </div>
        <div className="flex-1">
            <Article />
        </div>
    </div>
}