export type Wine = {
  id: string
  photo: string
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
}

export type WineDraft = {
  photo: string
  rating: number
  comment: string
}
