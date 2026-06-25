// TODO: Unused - no imports found. Remove if confirmed.

import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const Messages = ({ selected }: Props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V15C21 16.6569 19.6569 18 18 18H11.5L7.5 21.5V18H6C4.34315 18 3 16.6569 3 15V6Z"
        className={clsx(
          'dark:group-hover:fill-emerald-400 transition-all dark:fill-[#353346] fill-[#C0BFC4] group-hover:fill-emerald-600',
          { 'dark:!fill-emerald-400 !fill-emerald-600 ': selected }
        )}
      />
      <circle
        cx="8"
        cy="10.5"
        r="1.5"
        className={clsx(
          'dark:group-hover:fill-emerald-500 transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-emerald-400',
          { 'dark:!fill-emerald-500 fill-emerald-400': selected }
        )}
      />
      <circle
        cx="12"
        cy="10.5"
        r="1.5"
        className={clsx(
          'dark:group-hover:fill-emerald-500 transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-emerald-400',
          { 'dark:!fill-emerald-500 fill-emerald-400': selected }
        )}
      />
      <circle
        cx="16"
        cy="10.5"
        r="1.5"
        className={clsx(
          'dark:group-hover:fill-emerald-500 transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-emerald-400',
          { 'dark:!fill-emerald-500 fill-emerald-400': selected }
        )}
      />
    </svg>
  )
}

export default Messages
