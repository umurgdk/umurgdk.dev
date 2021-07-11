export default function NavigationItem({ title, href }) {
    return <a
        className="text-sm block
                   text-gray-700
                   active:font-medium"
        href={href}>
        {title}
    </a>
}