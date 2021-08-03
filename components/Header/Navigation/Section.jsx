export default function Section({ title, children }) {
    return <div className="flex-col space-y-1">
        <p className="text-sm uppercase font-bold text-gray-400">
            {title}
        </p>

        {children}
    </div>
}