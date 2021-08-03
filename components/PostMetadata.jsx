import Tag from "./Tag";

export default function PostMetadata({ className }) {
    return <div className={className}>
        <span className="text-sm text-gray-500 font-medium">10 July 2021</span>
        <div className="inline ml-4 space-x-2">
            <Tag name="AppKit" />
            <Tag name="NSTextField" />
        </div>
    </div >
}
