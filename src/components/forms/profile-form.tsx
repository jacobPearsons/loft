'use client'

import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EditUserProfileSchema } from '@/lib/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, Save } from 'lucide-react'

type Props = {
  user: any
  onUpdate?: any
}

const ProfileForm = ({ user, onUpdate }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: 'onChange',
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  const handleSubmit = async (
    values: z.infer<typeof EditUserProfileSchema>
  ) => {
    setIsLoading(true)
    await onUpdate(values.name)
    setIsLoading(false)
  }

  useEffect(() => {
    form.reset({ name: user.name, email: user.email })
  }, [user, form])

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-neutral-300">Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your full name"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-neutral-300">Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={true}
                  placeholder="your@email.com"
                  type="email"
                  className="bg-neutral-800 border-neutral-700 text-white/60 placeholder:text-neutral-500 cursor-not-allowed"
                />
              </FormControl>
              <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2">
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProfileForm
