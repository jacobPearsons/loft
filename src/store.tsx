// TODO: Dead code - not imported anywhere. Remove if confirmed unused.

import { create } from 'zustand'

export interface Option {
  value: string
  label: string
  disable?: boolean
  /** fixed option that can't be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined
}

type FuzzieStore = {
  googleFile: Record<string, unknown>
  setGoogleFile: (googleFile: Record<string, unknown>) => void
  slackChannels: Option[]
  setSlackChannels: (slackChannels: Option[]) => void
  selectedSlackChannels: Option[]
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => void
}

export const useFuzzieStore = create<FuzzieStore>()((set) => ({
  googleFile: {},
  setGoogleFile: (googleFile: Record<string, unknown>) => set({ googleFile }),
  slackChannels: [],
  setSlackChannels: (slackChannels: Option[]) => set({ slackChannels }),
  selectedSlackChannels: [],
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) =>
    set({ selectedSlackChannels }),
}))


