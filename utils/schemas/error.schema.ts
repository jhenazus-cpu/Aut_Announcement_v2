export const errorSchema = {
  type: 'object',

  required: ['error', 'statusCode'],

  properties: {
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
          type: 'string'
        },

        code: {
          type: 'string'
        },

        message: {
          type: 'string'
        },

        details: {
          type: 'array'
        }
      }
    },

    statusCode: {
      type: 'number',
      enum: [400, 404, 409, 500]
    }
  }
};