import Section from './Section'
import NavigationItem from './NavigationItem'

export default function Navigation() {
    return <div className="flex mt-10">
        <div className="flex-1">
            <Section title="Articles">
                <NavigationItem title="macOS Development" href="#macOS-dev" />
                <NavigationItem title="iOS Development" href="#" />
                <NavigationItem title="UI Design" href="#" />
            </Section>
        </div>
        <div className="flex-1">
            <Section title="Design">
                <NavigationItem title="Mobile" href="#" />
                <NavigationItem title="Desktop" href="#" />
                <NavigationItem title="Big Screen" href="#" />
            </Section>
        </div>
        <div className="flex-1">
            <Section title="Apps">
                <NavigationItem title="Tribal for Mac" href="#" />
                <NavigationItem title="Stash.it" href="#" />
            </Section>
        </div>
        <div className="flex-1">
            <Section title="Social">
                <NavigationItem title="Twitter" href="#" />
                <NavigationItem title="Github" href="#" />
            </Section>
        </div>
    </div>
}