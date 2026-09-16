export enum AppliesTo {
Students = 0,
Teachers = 1,
Administrative = 2,
Guardians = 3
}
export const announcementBaseSchema = {
  type: 'object',

  required: [
    'id',
    'name',
    'description',
    'appliesTo',
    'programs',
    'grades',
    'startDate',
    'endDate',
    'campusSchedules',
    'isActive',
    'createdAt',
    'updatedAt'
  ],

  properties: {
    id: { type: 'number' },

    name: { type: 'string' },

    description: { type: 'string' },
    
    appliesTo: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: {
        type: 'number',
        enum: [0, 1, 2, 3],
      }
    },

    programs: {
      type: 'array',
      items: {
        type: 'object',
        required: ['code', 'name'],
        properties: {
          code: { type: 'string' },
          name: { type: 'string' }
        }
      }
    },

    grades: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      }
    },

    startDate: {
      type: ['string', 'null']
    },

    endDate: {
      type: ['string', 'null']
    },

    campusSchedules: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      }
    },

    isActive: {
      type: 'boolean'
    },

    createdAt: {
      type: 'string'
    },

    updatedAt: {
      type: ['string', 'null']
    },

    period: {
      type: ['object', 'null'],
      properties: {
        id: { type: 'number' },
        name: { type: 'string' }
      }
    },

    attachments: {
      type: 'array'
    }
  }
};
