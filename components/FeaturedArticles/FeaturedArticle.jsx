import Image from 'next/image'
import ImageContent from '../../public/article-images/custom-nstextfield/ImageContent@2x.png'
import PostMetadata from '../PostMetadata'

export default function FeaturedArticle() {
    return <div>
        <ArticleImage />
        <div className="text-inset mt-4">
            <p className="text-base text-gray-700 font-medium">Adding inline buttons to NSTextField</p>
            <p className="text-sm text-gray-500 leading-tight mt-1">Details about how NSTextField uses its cell class to align its layout and its field editor.</p>
            <PostMetadata className="mt-1.5" />
        </div>
    </div>
}

function ArticleImage() {
    return <div className="bg-white image-inset elevated-container">
        <Image src={ImageContent} layout="intrinsic" objectFit="cover" />
    </div>
}