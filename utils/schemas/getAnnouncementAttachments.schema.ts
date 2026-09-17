export const getAnnouncementAttachmentsSchema = {
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
              'fileName',
              'filePath',
              'sizeInBytes',
              'contentType',
              'extension',
              'uploadedAt',
              'thumbnailPath',
              'categoryCode',
              'referenceCode',
              'metadata',
              'embedded'
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

              sizeInBytes: {
                type: 'integer',
                minimum: 0
              },

              contentType: {
                type: 'string'
              },

              extension: {
                type: 'string'
              },

              uploadedAt: {
                type: 'string'
              },

              thumbnailPath: {
                type: ['string', 'null']
              },

              categoryCode: {
                type: 'string'
              },

              referenceCode: {
                type: 'string'
              },

              metadata: {
                type: ['object', 'null']
              },

              embedded: {
                type: 'boolean'
              }
            }
          }
        }
      }
    }
  }
};