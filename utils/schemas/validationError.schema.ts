export const validationErrorSchema = {
  type: 'object',

  required: ['error', 'statusCode'],

  properties: {
    statusCode: {
      type: 'number',
      const: 400
    },

    error: {
      type: 'object',

      required: [
        'type',
        'code',
        'message',
        'details'
      ],

      properties: {
        type: {
          type: 'string',
          const: 'VALIDATION'
        },

        code: {
          type: 'string',
          const: 'HTTP.VALIDATION'
        },

        message: {
          type: 'string',
          const: 'Validation failed'
        },

        details: {
          type: 'array',

          minItems: 1,

          items: {
            type: 'object',

            required: [
              'property',
              'errors'
            ],

            properties: {
              property: {
                type: 'string'
              },

              value: {
                anyOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'boolean' },
                  { type: 'null' },
                  { type: 'array' }
                ]
              },

              errors: {
                type: 'array',

                minItems: 1,

                items: {
                  type: 'string'
                }
              },

              attributes: {
                type: 'object',

                properties: {
                  missing: {
                    type: 'array',

                    items: {
                      type: 'string'
                    }
                  }
                },

                additionalProperties: true
              }
            }
          }
        }
      }
    }
  }
};
