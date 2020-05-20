import { FormProps } from '@rjsf/core';
import { IConnection } from '@sqltools/types';

export default function prepareSchema(
  schema: FormProps<IConnection>['schema'],
  uiSchema: FormProps<IConnection>['uiSchema'] = {}
): {
  schema: FormProps<IConnection>['schema'];
  uiSchema: FormProps<IConnection>['uiSchema'];
} {
  const combinedSchema: FormProps<IConnection>['schema'] = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    ...schema,
    properties: {
      name: {
        type: 'string',
        title: 'Connection name',
      },
      group: {
        type: 'string',
        title: 'Connection group',
      },
      ...(schema.properties || {}),
      previewLimit: {
        default: 50,
        type: 'number',
        title: 'Show records default limit',
      },
    },
    required: ['name', ...(schema.required || [])],
  };

  const uiCombinedSchema: FormProps<IConnection>['uiSchema'] = {
    ...uiSchema,
  };

  return {
    schema: combinedSchema,
    uiSchema: uiCombinedSchema
  }
}