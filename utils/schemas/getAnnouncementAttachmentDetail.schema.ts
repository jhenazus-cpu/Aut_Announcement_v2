export const getAnnouncementAttachmentDetailSchema = {
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
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}$',
        },

        thumbnailPath: {
          type: ['string', 'null']
        },

        categoryCode: {
            oneOf: [
                { type: 'null' },
                { type: 'string' },
            ],
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
};