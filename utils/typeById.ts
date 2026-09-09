import { Item } from './type';

export interface announcementsResponseById {
  data: Item
  statusCode: number
}
export interface AnnouncementNotFound {
  error: Error
  statusCode: number
}

export interface Error {
  type: string
  code: string
  message: string
  details: Detail[]
}

export interface Detail {
  property: string
  errors: string[]
}