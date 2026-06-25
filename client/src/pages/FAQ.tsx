import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import PageShell from '@/components/layout/PageShell'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Click the "Get Started" button on the top right, fill in your details, and verify your email address. It takes less than 2 minutes to get started.',
  },
  {
    question: 'How do I apply for a job?',
    answer: 'Browse available jobs, click on any position that interests you, and hit the "Apply Now" button. You can include a cover letter with your application.',
  },
  {
    question: 'Can I save jobs to apply later?',
    answer: 'Yes! Click the bookmark icon on any job card or detail page to save it. Access your saved jobs anytime from the "Saved Jobs" section in your account menu.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click "Forgot password?" on the login page, enter your email address, and we\'ll send you a password reset link if an account exists.',
  },
  {
    question: 'How do I update my profile?',
    answer: 'Go to your Profile page from the account menu. You can update your personal information, add skills, upload a profile picture, and more.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Visit our Contact page and fill out the form, or email us directly at hiring.pathmatch@gmail.com. We typically respond within 24 hours.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption, secure authentication, and never share your personal data with third parties without your consent.',
  },
  {
    question: 'Can employers post jobs?',
    answer: 'Yes! Create an employer account and you\'ll be able to post job listings, manage applications, and communicate with candidates through our platform.',
  },
]

export default function FAQ() {
  const reduced = useReducedMotion()

  return (
    <PageShell>
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-3xl mx-auto">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h1>
              <p className="text-sm text-neutral-400 mt-1">Find answers to common questions about our platform</p>
            </div>
          </div>

          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-white hover:bg-white/[0.02] transition-colors min-h-[44px]">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 text-neutral-500 shrink-0 ml-4 accordion-chevron transition-transform duration-200" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-5 pb-4 text-sm text-neutral-400 leading-relaxed">
                  {faq.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </PageShell>
  )
}
