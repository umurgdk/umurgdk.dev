import Link from 'next/link'

interface Props {
    post: { link: string, module: { meta: any } }
}

export function Post({ post }: Props) {
    const { link, module: { meta } } = post
    return <article>

    </article>
}