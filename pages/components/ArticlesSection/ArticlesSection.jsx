import Image from 'next/image'
import SearchField from '../SearchField'
import ImageContent from '../../../public/article-images/custom-nstextfield/mini-thumbnail@2x.png'
import Tag from '../Tag'


export default function ArticlesSection() {
    return <div className="page-inset bg-gradient-to-b from-gray-100 to-gray-50 border-t border-gray-300">
        <div className="flex justify-between items-baseline">
            <h1 className="text-inset text-base font-bold text-gray-400">RECENT ARTICLES</h1>
            <SearchField placeholder="Search articles..." />
        </div>
        <ArticleList />
    </div>
}

function ArticleList() {
    return <div className="elevated-container mt-8 divide-y divide-gray-200">
        <ArticleItem />
        <ArticleItem />
        <ArticleItem />
        <ArticleItem />
        <ArticleItem />
        <ArticleItem />
        <ArticleItem />
        <ArticleItem />
    </div>
}

function ArticleItem() {
    return <div className="image-inset flex bg-white">
        <SmallImage />
        <div className="flex-col text-inset">
            <a href="#" className="block text-base text-gray-700 font-medium leading-4">Adding inline buttons to NSTextField</a>
            <span className="block text-sm text-gray-500 leading-6">Details about how NSTextField uses its cell class to align its layout and its field editor.</span>
            <div className="flex space-x-4 leading-4">
                <Tag name="AppKit" />
                <Tag name="NSTextField" />
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