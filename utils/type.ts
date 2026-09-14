export interface announcementsResponse {
  data: Data
  statusCode: number
}

export interface createAnnouncementsResponse {
  data: Item
  statusCode: number
}

export interface Data {
  items: Item[]
  totalCount: number
}

export interface Item {
  id: number
  name: string
  description: string
  appliesTo: number[]
  createdAt: string
  startDate: string
  endDate: string
  updatedAt: string
  period: Period
  campusSchedules: CampusSchedule[]
  isActive: boolean
  grades: Grade[]
  programs: Program[]
  attachments: Attachment[]
}

export interface Period {
  id: number
  name: string
}

export interface CampusSchedule {
  id: number
  name: string
}

export interface Program {
  code: string
  name: string
}

export interface Grade {
  id: number
  name: string
}

export interface Attachment {
  id: number
  fileName: string
  filePath: string
  extension: string
  contentType: string
}

export interface AttachmentResponse {
  data: Data
  statusCode: number
}

export interface GetDetailsAttachmentResponse {
  data: Item
  statusCode: number
}

export interface Data {
  items: Item[]
  totalCount: number
}

export interface Item {
  id: number
  fileName: string
  filePath: string
  sizeInBytes: number
  contentType: string
  extension: string
  uploadedAt: string
  thumbnailPath: any
  categoryCode: string
  referenceCode: string
  metadata: any
  embedded: boolean
}

export interface UpdateAnnouncementResponse {
  data: DataUpdateAnnouncement
  statusCode: number
}

export interface DataUpdateAnnouncement {
  id: number
}