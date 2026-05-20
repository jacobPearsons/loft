/**
 * Sign In Page
 * 
 * Redirects to custom auth page
 */

import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/auth')
}