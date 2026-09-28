import Page from '../components/Page'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Categories from '../sections/Categories'
import Brands from '../sections/Brands'
import Sectors from '../sections/Sectors'
import Process from '../sections/Process'
import Testimonials from '../sections/Testimonials'
import CTA from '../sections/CTA'

export default function Home() {
  return (
    <Page>
      <Hero />
      <About />
      <Categories />
      <Brands />
      <Sectors />
      <Process />
      <Testimonials />
      <CTA />
    </Page>
  )
}
