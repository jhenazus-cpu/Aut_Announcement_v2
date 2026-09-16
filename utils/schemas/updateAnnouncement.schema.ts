export const updateAnnouncementSchema = {
  type: 'object',

  required: ['data', 'statusCode'],

  properties: {
    statusCode: {
      type: 'number',
      const: 200
    },

    data: {
      type: 'object',

      required: ['id'],

      properties: {
        id: {
          type: 'number'
        }
      }
    }
  }
};
