export default function PageWrapper({ children }) {
    return <div className="page-wrapper lg:container lg:mx-auto bg-gray-50 min-h-screen antialiased">
        {children}
    </div>;
}