import PageShell from '@/components/layout/PageShell'
import InfoPanel from '@/components/sections/contact/InfoPanel'
import ContactFormSection from '@/components/sections/contact/ContactForm'
import MapSection from '@/components/sections/contact/MapSection'

export default function Contact() {
  return (
    <PageShell>
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 mb-12 sm:mb-16">
            <InfoPanel />
            <ContactFormSection />
          </div>
          <MapSection />
        </div>
      </section>
    </PageShell>
  )
}
