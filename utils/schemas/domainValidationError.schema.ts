export const domainValidationErrorSchema = {
  type: 'object',

  required: ['error', 'statusCode'],

  properties: {
    statusCode: {
      type: 'integer',
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
          const: 'DOMAIN_VALIDATION'
        },

        code: {
          type: 'string',
          const: 'HTTP.DOMAIN_VALIDATION'
        },

        message: {
          type: 'string',
          const: 'Domain validation failed.'
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

              errors: {
                type: 'array',

                minItems: 1,

                items: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
};