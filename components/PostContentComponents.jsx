import Image from "next/image"

export function h1({ children }) {
    return <h1 className="text-inset text-3xl font-bold mb-16">{children}</h1>
}

export function h2({ children }) {
    return <h2 className="text-inset text-xl font-bold">{children}</h2>
}

export function p({ children }) {
    return <p className="text-inset mb-10">{children}</p>
}

export function inlineCode({ children }) {
    return <code className="bg-yellow-50 border border-yellow-200 px-1 rounded text-black">{children}</code>
}

export function img(props) {
    return <div className="image-container bg-white image-inset shadow-lg"><Image {...props} layout="fill" /></div>
}