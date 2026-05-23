/**
 * Sign Up Page
 * 
 * Redirects to native auth page with register
 */

import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/auth')
}
