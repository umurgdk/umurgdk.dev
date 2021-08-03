import Link from "next/link";

export default function SiteTitle() {
    return <div className="flex-col font-400">
        <p className="text-xl font-medium">
            <Link href="/">Umur Gedik</Link>
        </p>
        <p className="text-base font-medium text-gray-400">Software Developer & Designer</p>
    </div>
}