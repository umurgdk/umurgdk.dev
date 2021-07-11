import '../styles/globals.css'
// import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import PageWrapper from './components/PageWrapper'
import Header from './components/Header/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return <PageWrapper>
    <Header />
    <Component {...pageProps} />
  </PageWrapper>
}
export default MyApp
