export const getAnnouncementByIdSchema = {
  type: 'object',

  required: [
    'data',
    'statusCode'
  ],

  properties: {
    statusCode: {
      type: 'integer',
      const: 200
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
        'period',
        'attachments'
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

            required: [
              'code',
              'name'
            ],

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
          type: 'array',

          items: {
            type: 'object',

            required: [
              'id',
              'name'
            ],

            properties: {
              id: {
                type: 'integer'
              },

              name: {
                type: 'string'
              }
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

            required: [
              'id',
              'name'
            ],

            properties: {
              id: {
                type: 'integer'
              },

              name: {
                type: 'string'
              }
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
          anyOf: [
            {
              type: 'object',

              required: [
                'id',
                'name'
              ],

              properties: {
                id: {
                  type: 'integer'
                },

                name: {
                  type: 'string'
                }
              }
            },
            {
              type: 'null'
            }
          ]
        },

        attachments: {
          type: 'array'
        }
      }
    }
  }
};