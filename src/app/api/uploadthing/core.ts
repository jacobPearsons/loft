import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { fileUrl: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
