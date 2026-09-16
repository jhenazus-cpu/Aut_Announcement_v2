export enum AppliesTo {
Students = 0,
Teachers = 1,
Administrative = 2,
Guardians = 3
}
export const getAllAnnouncementsSchema = {
  type: 'object',

  required: ['data', 'statusCode'],

  properties: {
    statusCode: {
      type: 'integer',
      const: 200
    },

    data: {
      type: 'object',

      required: [
        'items',
        'totalCount'
      ],

      properties: {
        totalCount: {
          type: 'integer',
          minimum: 0
        },

        items: {
          type: 'array',

          items: {
            type: 'object',

            required: [
              'id',
              'name',
              'description',
              'appliesTo',
              'createdAt',
              'startDate',
              'endDate',
              'period',
              'campusSchedules',
              'grades',
              'programs',
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

                items: {
                  type: 'integer',
                  enum: [0, 1, 2, 3]
                }
              },

              createdAt: {
                type: 'string'
              },

              startDate: {
                type: ['string', 'null']
              },

              endDate: {
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

              attachments: {
                type: 'array',

                items: {
                  type: 'object',

                  required: [
                    'id',
                    'fileName',
                    'filePath',
                    'extension',
                    'contentType'
                  ],

                  properties: {
                    id: {
                      type: 'integer'
                    },

                    fileName: {
                      type: 'string'
                    },

                    filePath: {
                      type: 'string'
                    },

                    extension: {
                      type: 'string'
                    },

                    contentType: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};