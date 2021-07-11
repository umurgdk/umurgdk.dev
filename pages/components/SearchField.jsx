export default function SearchField({ placeholder }) {
    return <div className="relative search p-px rounded-full bg-gradient-to-b from-gray-300 to-gray-200 shadow-emboss">
        <img className="absolute top-2 left-3" src="/icons/search.svg" />
        <input
            type="search"
            className="appearance-none
                   rounded-full
                   bg-white
                   h-8
                   border-1
                   text-sm
                   px-4 pl-9
                   shadow-inner"
            placeholder={placeholder} />
    </div>
}