import SiteTitle from './SiteTitle'
import Navigation from './Navigation/Navigation'

export default function Header() {
    return <div className="bg-gradient-to-b from-white to-gray-50 page-inset">
        <div className="text-inset">
            <SiteTitle />
            <Navigation />
        </div>
    </div>
}