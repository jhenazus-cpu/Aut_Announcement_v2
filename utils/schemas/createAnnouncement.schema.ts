export enum AppliesTo {
  Students = 0,
  Teachers = 1,
  Administrative = 2,
  Guardians = 3
}

export const createAnnouncementSchema = {
  type: 'object',

  required: ['data', 'statusCode'],

  properties: {
    statusCode: {
      type: 'number',
      const: 201
    },

    data: {
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
        'updatedAt',
        'period'
      ],

      properties: {
        id: {
          type: 'integer'
        },

        name: {
          type: 'string'
        },

        description: {
          type: 'string'
        },

        appliesTo: {
          type: 'array',
          minItems: 1,
          uniqueItems: true,
          items: {
            type: 'integer',
            enum: [0, 1, 2, 3]
          }
        },

        programs: {
          type: 'array',
          items: {
            type: 'object',

            required: ['code', 'name'],

            properties: {
              code: {
                type: 'string'
              },

              name: {
                type: 'string'
              }
            }
          }
        },

        grades: {
          type: 'array'
        },

        startDate: {
          type: ['string', 'null']
        },

        endDate: {
          type: ['string', 'null']
        },

        campusSchedules: {
          type: 'array'
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
          type: 'object',

          required: ['id', 'name'],

          properties: {
            id: {
              type: 'integer'
            },

            name: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};
``
