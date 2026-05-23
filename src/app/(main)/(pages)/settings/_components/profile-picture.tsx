'use client'
import React from 'react'
import UploadCareButton from './uploadcare-button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, User } from 'lucide-react'

type Props = {
  userImage: string | null
  onDelete?: any
  onUpload: any
}

const ProfilePicture = ({ userImage, onDelete, onUpload }: Props) => {
  const router = useRouter()

  const onRemoveProfileImage = async () => {
    const response = await onDelete()
    if (response) {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {userImage ? (
          <div className="relative h-28 w-28 rounded-full overflow-hidden ring-2 ring-emerald-500/30">
            <Image
              src={userImage}
              alt="User_Image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-28 w-28 rounded-full bg-muted ring-2 ring-neutral-700 flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute -bottom-1 -right-1">
          <UploadCareButton onUpload={onUpload} />
        </div>
      </div>
      {userImage && (
        <Button
          onClick={onRemoveProfileImage}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      )}
    </div>
  )
}

export default ProfilePicture
