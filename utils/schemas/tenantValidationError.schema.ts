export const tenantValidationErrorSchema = {
  type: "object",
  required: ["error", "statusCode"],
  properties: {
    statusCode: {
      type: "number",
      const: 400,
    },
    error: {
      type: "object",
      required: ["type", "code", "message", "details"],
      properties: {
        type: {
          type: "string",
          const: "VALIDATION",
        },
        code: {
          type: "string",
          const: "HTTP.VALIDATION",
        },
        message: {
          type: "string",
        },
        details: {
          type: "array",
        },
      },
    },
  },
};