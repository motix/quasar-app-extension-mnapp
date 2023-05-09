import { isArray, isDate, isObject } from 'lodash';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingConfiguration,
  mapWithArguments,
  ModelIdentifier,
  Resolver,
} from '@automapper/core';
import { PojoMetadata } from '@automapper/pojos';

import { date } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

import { Timestamp } from '@firebase/firestore';

export type MapperMetadata<TModel> = {
  [key in keyof TModel]?:
    | PojoMetadata
    | [PojoMetadata]
    | {
        type: PojoMetadata | [PojoMetadata];
        depth: number;
      };
};

export interface DateDataConverter {
  fromDate: <T>(date: Date) => T;
  toDate: <T>(data: T) => Date;
}

const { editDateFormat, dateDataConverter } = requiredConfigEntries(
  'editDateFormat',
  'dateDataConverter'
);

type HasProp<Key extends string, T> = Record<Key, T>;

const apiModelToModelResolver = {
  dateRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, DateDataType>
  >(key: Key) {
    return {
      resolve: (source: TSource): Date =>
        dateDataConverter.toDate<DateDataType>(source[key]),
    };
  },

  dateArrayRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, DateDataType[]>
  >(key: Key) {
    return {
      resolve: (source: TSource): Date[] =>
        source[key].map((value) =>
          dateDataConverter.toDate<DateDataType>(value)
        ),
    };
  },

  asIsRequired: function <
    Key extends string,
    Type extends object,
    TSource extends HasProp<Key, Type>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type => replaceTimestamp(source[key]),
    };
  },

  mixedOptional: function <
    Key extends string,
    Type extends string | boolean | number,
    TSource extends Partial<HasProp<Key, Type | null>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type | undefined =>
        source[key]?.valueOf() as Type | undefined,
    };
  },

  dateOptional: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, DateDataType | null>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Date | undefined => {
        const field: DateDataType | null | undefined = source[key];
        return field == null ? undefined : dateDataConverter.toDate(field);
      },
    };
  },

  dateArrayOptional: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, DateDataType[] | null>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Date[] | undefined => {
        const field: DateDataType[] | null | undefined = source[key];
        return field == null
          ? undefined
          : field.map((value) => dateDataConverter.toDate(value));
      },
    };
  },

  asIsOptional: function <
    Key extends string,
    Type extends object,
    TSource extends Partial<HasProp<Key, Type | null>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type | undefined => {
        const field: Type | null | undefined = source[key];
        return field == null ? undefined : replaceTimestamp(field);
      },
    };
  },
};

const modelToViewModelResolver = {
  dateRequired: function <
    Key extends string,
    TSource extends HasProp<Key, Date>
  >(key: Key) {
    return {
      resolve: (source: TSource): string =>
        date.formatDate(source[key], editDateFormat),
    };
  },

  dateArrayRequired: function <
    Key extends string,
    TSource extends HasProp<Key, Date[]>
  >(key: Key) {
    return {
      resolve: (source: TSource): string[] =>
        source[key].map((value) => date.formatDate(value, editDateFormat)),
    };
  },

  asIsRequired: function <
    Key extends string,
    Type extends object,
    TSource extends HasProp<Key, Type>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type => source[key],
    };
  },

  stringOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, string>>
  >(key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key];
        return field === undefined ? '' : field;
      },
    };
  },

  booleanOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, boolean>>
  >(key: Key) {
    return {
      resolve: (source: TSource): boolean | null => {
        const field = source[key];
        return field === undefined ? null : field;
      },
    };
  },

  numberOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, number>>
  >(key: Key) {
    return {
      resolve: (source: TSource): number | '' => {
        const field = source[key];
        return field === undefined ? '' : field;
      },
    };
  },

  dateOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, Date>>
  >(key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key];
        return field === undefined
          ? ''
          : date.formatDate(field, editDateFormat);
      },
    };
  },

  dateArrayOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, Date[]>>
  >(key: Key) {
    return {
      resolve: (source: TSource): string[] | null => {
        const field = source[key];
        return field === undefined
          ? null
          : field.map((value) => date.formatDate(value, editDateFormat));
      },
    };
  },

  asIsOptional: function <
    Key extends string,
    Type extends object,
    TSource extends Partial<HasProp<Key, Type>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type | null => {
        const field: Type | undefined = source[key];
        return field === undefined ? null : field;
      },
    };
  },
};

const modelToApiModelResolver = {
  dateRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, Date>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType =>
        dateDataConverter.fromDate(source[key]),
    };
  },

  dateArrayRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, Date[]>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType[] =>
        source[key].map((value) => dateDataConverter.fromDate(value)),
    };
  },

  asIsRequired: function <
    Key extends string,
    Type extends object,
    TSource extends HasProp<Key, Type>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type => deleteUndefined(source[key]),
    };
  },

  mixedOptional: function <
    Key extends string,
    Type extends string | boolean | number,
    TSource extends Partial<HasProp<Key, Type>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type | null => {
        const field: Type | undefined = source[key];
        return field === undefined ? null : field;
      },
    };
  },

  readOptionalWriteRequired: function <
    Key extends string,
    Type extends string | boolean | number,
    TSource extends Partial<HasProp<Key, Type>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type => {
        const field: Type | undefined = source[key];
        field === undefined &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return field;
      },
    };
  },

  dateOptional: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, Date>>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType | null => {
        const field = source[key];
        return field === undefined
          ? null
          : dateDataConverter.fromDate<DateDataType>(field);
      },
    };
  },

  dateArrayOptional: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, Date[]>>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType[] | null => {
        const field = source[key];
        return field === undefined
          ? null
          : field.map((value) =>
              dateDataConverter.fromDate<DateDataType>(value)
            );
      },
    };
  },

  dateReadOptionalWriteRequired: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, Date>>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType => {
        const field = source[key];
        field === undefined &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return dateDataConverter.fromDate(field);
      },
    };
  },

  dateArrayReadOptionalWriteRequired: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, Date[]>>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType[] => {
        const field = source[key];
        field === undefined &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return field.map((value) => dateDataConverter.fromDate(value));
      },
    };
  },

  asIsOptional: function <
    Key extends string,
    Type extends object,
    TSource extends Partial<HasProp<Key, Type>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type | null => {
        const field: Type | undefined = source[key];
        return field === undefined ? null : deleteUndefined(field);
      },
    };
  },
};

const viewModelToApiModelResolver = {
  stringRequired: function <
    Key extends string,
    TSource extends HasProp<Key, string>
  >(key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key];
        field === '' &&
          (() => {
            throw new Error(`${key} is required`);
          })();
        return field;
      },
    };
  },

  numberRequired: function <
    Key extends string,
    TSource extends HasProp<Key, number | string>
  >(key: Key) {
    return {
      resolve: (source: TSource): number => {
        const field = source[key];
        typeof field === 'string' &&
          field !== '' &&
          (() => {
            throw new Error(`${key} has invalid string value '${field}'`);
          })();
        field === '' &&
          (() => {
            throw new Error(`${key} is required`);
          })();
        return field;
      },
    };
  },

  dateRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType =>
        dateDataConverter.fromDate(
          date.extractDate(source[key], editDateFormat)
        ),
    };
  },

  dateArrayRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string[]>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType[] =>
        source[key].map((value) =>
          dateDataConverter.fromDate(date.extractDate(value, editDateFormat))
        ),
    };
  },

  asIsRequired: function <
    Key extends string,
    Type extends object,
    TSource extends Partial<HasProp<Key, Type>>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type => {
        const field: Type | undefined = source[key];
        field === undefined &&
          (() => {
            throw new Error(`${key} is required`);
          })();
        return deleteUndefined(field);
      },
    };
  },

  stringOptional: function <
    Key extends string,
    TSource extends HasProp<Key, string | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): string | null => {
        const field = source[key];
        return field === '' ? null : field;
      },
    };
  },

  stringReadOptionalWriteRequired: function <
    Key extends string,
    TSource extends HasProp<Key, string | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key];
        (field === '' || field === null) &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return field;
      },
    };
  },

  booleanReadOptionalWriteRequired: function <
    Key extends string,
    TSource extends HasProp<Key, boolean | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): boolean => {
        const field = source[key];
        field === null &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return field;
      },
    };
  },

  numberOptional: function <
    Key extends string,
    TSource extends HasProp<Key, number | string | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): number | null => {
        const field = source[key];
        typeof field === 'string' &&
          field !== '' &&
          (() => {
            throw new Error(`${key} has invalid string value '${field}'`);
          })();
        return field === '' ? null : field;
      },
    };
  },

  numberReadOptionalWriteRequired: function <
    Key extends string,
    TSource extends HasProp<Key, number | string | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): number => {
        const field = source[key];
        typeof field === 'string' &&
          field !== '' &&
          (() => {
            throw new Error(`${key} has invalid string value '${field}'`);
          })();
        (field === '' || field === null) &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return field;
      },
    };
  },

  dateOptional: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType | null => {
        const field = source[key];
        return field === '' || field === null
          ? null
          : dateDataConverter.fromDate<DateDataType>(
              date.extractDate(field, editDateFormat)
            );
      },
    };
  },

  dateArrayOptional: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string[] | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType[] | null => {
        const field = source[key];
        return field === null
          ? null
          : field.map((value) =>
              dateDataConverter.fromDate<DateDataType>(
                date.extractDate(value, editDateFormat)
              )
            );
      },
    };
  },

  dateReadOptionalWriteRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType => {
        const field = source[key];
        (field === '' || field === null) &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return dateDataConverter.fromDate(
          date.extractDate(field, editDateFormat)
        );
      },
    };
  },

  dateArrayReadOptionalWriteRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string[] | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): DateDataType[] => {
        const field = source[key];
        field === null &&
          (() => {
            throw new Error(`${key} is required for saving`);
          })();
        return field.map((value) =>
          dateDataConverter.fromDate(date.extractDate(value, editDateFormat))
        );
      },
    };
  },

  asIsOptional: function <
    Key extends string,
    Type extends object,
    TSource extends HasProp<Key, Type | null>
  >(key: Key) {
    return {
      resolve: (source: TSource): Type | null => {
        const field: Type | null = source[key];
        return field === null ? null : deleteUndefined(field);
      },
    };
  },
};

function deleteUndefined<T extends object>(value: T) {
  for (const key in value) {
    const field = value[key];

    if (field === undefined) {
      delete value[key];
    } else if (isObject(field)) {
      if (isArray(field)) {
        field.forEach((item) => deleteUndefined(item));
      } else {
        deleteUndefined(field);
      }
    }
  }

  return value;
}

function isTimestamp(value: unknown): value is Timestamp {
  return (
    typeof (value as Timestamp).toDate === 'function' &&
    isDate((value as Timestamp).toDate())
  );
}

function replaceTimestamp<T extends object>(value: T) {
  if (isArray(value)) {
    value.forEach((item) => {
      replaceTimestamp(item);
    });
  } else {
    for (const key in value) {
      const field = value[key];

      if (field == null) {
        return value;
      }

      if (isTimestamp(field)) {
        value[key] = field.toDate() as unknown as T[Extract<keyof T, string>];
      } else if (isObject(field)) {
        if (isArray(field)) {
          field.forEach((item, index) => {
            field[index] = isTimestamp(item)
              ? item.toDate()
              : replaceTimestamp(item);
          });
        } else {
          replaceTimestamp(field);
        }
      }
    }
  }

  return value;
}

type DataType = 'string' | 'boolean' | 'number' | 'date' | 'dateArray' | 'asIs';
type FieldType = 'required' | 'optional' | 'readOptionalWriteRequired';

type ResolverDataTypes = Partial<
  Record<DataType, (fieldName: string) => Resolver>
>;
type ResolverFieldTypes = Record<FieldType, ResolverDataTypes>;
type Resolvers = {
  apiModelToModel: ResolverFieldTypes;
  modelToViewModel: ResolverFieldTypes;
  modelToApiModel: ResolverFieldTypes;
  viewModelToApiModel: ResolverFieldTypes;
};

const resolvers: Resolvers = {
  apiModelToModel: {
    required: {
      string: undefined,
      boolean: undefined,
      number: undefined,
      date: apiModelToModelResolver.dateRequired,
      dateArray: apiModelToModelResolver.dateArrayRequired,
      asIs: apiModelToModelResolver.asIsRequired,
    },
    optional: {
      string: apiModelToModelResolver.mixedOptional,
      boolean: apiModelToModelResolver.mixedOptional,
      number: apiModelToModelResolver.mixedOptional,
      date: apiModelToModelResolver.dateOptional,
      dateArray: apiModelToModelResolver.dateArrayOptional,
      asIs: apiModelToModelResolver.asIsOptional,
    },
    readOptionalWriteRequired: {
      string: apiModelToModelResolver.mixedOptional,
      boolean: apiModelToModelResolver.mixedOptional,
      number: apiModelToModelResolver.mixedOptional,
      date: apiModelToModelResolver.dateOptional,
      dateArray: apiModelToModelResolver.dateArrayOptional,
      asIs: undefined, // TODO:
    },
  },
  modelToViewModel: {
    required: {
      string: undefined,
      boolean: undefined,
      number: undefined,
      date: modelToViewModelResolver.dateRequired,
      dateArray: modelToViewModelResolver.dateArrayRequired,
      asIs: modelToViewModelResolver.asIsRequired,
    },
    optional: {
      string: modelToViewModelResolver.stringOptional,
      boolean: modelToViewModelResolver.booleanOptional,
      number: modelToViewModelResolver.numberOptional,
      date: modelToViewModelResolver.dateOptional,
      dateArray: modelToViewModelResolver.dateArrayOptional,
      asIs: modelToViewModelResolver.asIsOptional,
    },
    readOptionalWriteRequired: {
      string: modelToViewModelResolver.stringOptional,
      boolean: modelToViewModelResolver.booleanOptional,
      number: modelToViewModelResolver.numberOptional,
      date: modelToViewModelResolver.dateOptional,
      dateArray: modelToViewModelResolver.dateArrayOptional,
      asIs: undefined, // TODO:
    },
  },
  modelToApiModel: {
    required: {
      string: undefined,
      boolean: undefined,
      number: undefined,
      date: modelToApiModelResolver.dateRequired,
      dateArray: modelToApiModelResolver.dateArrayRequired,
      asIs: modelToApiModelResolver.asIsRequired,
    },
    optional: {
      string: modelToApiModelResolver.mixedOptional,
      boolean: modelToApiModelResolver.mixedOptional,
      number: modelToApiModelResolver.mixedOptional,
      date: modelToApiModelResolver.dateOptional,
      dateArray: modelToApiModelResolver.dateArrayOptional,
      asIs: modelToApiModelResolver.asIsOptional,
    },
    readOptionalWriteRequired: {
      string: modelToApiModelResolver.readOptionalWriteRequired,
      boolean: modelToApiModelResolver.readOptionalWriteRequired,
      number: modelToApiModelResolver.readOptionalWriteRequired,
      date: modelToApiModelResolver.dateReadOptionalWriteRequired,
      dateArray: modelToApiModelResolver.dateArrayReadOptionalWriteRequired,
      asIs: undefined, // TODO:
    },
  },
  viewModelToApiModel: {
    required: {
      string: viewModelToApiModelResolver.stringRequired,
      boolean: undefined,
      number: viewModelToApiModelResolver.numberRequired,
      date: viewModelToApiModelResolver.dateRequired,
      dateArray: viewModelToApiModelResolver.dateArrayRequired,
      asIs: viewModelToApiModelResolver.asIsRequired,
    },
    optional: {
      string: viewModelToApiModelResolver.stringOptional,
      boolean: undefined,
      number: viewModelToApiModelResolver.numberOptional,
      date: viewModelToApiModelResolver.dateOptional,
      dateArray: viewModelToApiModelResolver.dateArrayOptional,
      asIs: viewModelToApiModelResolver.asIsOptional,
    },
    readOptionalWriteRequired: {
      string: viewModelToApiModelResolver.stringReadOptionalWriteRequired,
      boolean: viewModelToApiModelResolver.booleanReadOptionalWriteRequired,
      number: viewModelToApiModelResolver.numberReadOptionalWriteRequired,
      date: viewModelToApiModelResolver.dateReadOptionalWriteRequired,
      dateArray: viewModelToApiModelResolver.dateArrayReadOptionalWriteRequired,
      asIs: undefined, // TODO:
    },
  },
};

export type FieldConfig = {
  dataType: DataType;
  fieldType: FieldType;
};

function configureAndCreateMapsInternal<T, TVm, TAm>(
  mapper: Mapper,
  m: ModelIdentifier<T> | null,
  vm: ModelIdentifier<TVm> | null,
  am: ModelIdentifier<TAm> | null,
  fieldTypes: Partial<Record<keyof T & keyof TVm & keyof TAm, FieldConfig>>,
  additionalConfigurations?: {
    apiModelToModel?: MappingConfiguration<TAm, T>[];
    modelToViewModel?: MappingConfiguration<T, TVm>[];
    modelToApiModel?: MappingConfiguration<T, TAm>[];
    viewModelToApiModel?: MappingConfiguration<TVm, TAm>[];
  }
) {
  function getFieldNames() {
    const result: Extract<keyof T & keyof TVm & keyof TAm, string>[] = [];
    let fieldName: (typeof result)[number];

    for (fieldName in fieldTypes) {
      const config = fieldTypes[fieldName];
      if (config) {
        result.push(fieldName);
      }
    }

    return result;
  }

  function getConfigurations<
    TSource extends T | TVm | TAm,
    TDestination extends T | TVm | TAm
  >(resolverFieldTypes: ResolverFieldTypes) {
    const configurations = fieldNames
      .map((fieldName) => {
        const config = fieldTypes[fieldName];
        const method = config
          ? resolverFieldTypes[config.fieldType][config.dataType]
          : undefined;
        const configuration = method
          ? forMember<TSource, TDestination>(
              (d) => d[fieldName],
              mapFrom(method(fieldName))
            )
          : undefined;

        return configuration;
      })
      .filter((value) => !!value) as MappingConfiguration<
      TSource,
      TDestination
    >[];

    return configurations;
  }

  const fieldNames = getFieldNames();

  // API Model to Model
  if (am && m) {
    createMap(
      mapper,
      am,
      m,
      ...getConfigurations<TAm, T>(resolvers.apiModelToModel),
      ...(additionalConfigurations?.apiModelToModel || [])
    );
  }

  // Model to View Model
  if (m && vm) {
    createMap(
      mapper,
      m,
      vm,
      ...getConfigurations<T, TVm>(resolvers.modelToViewModel),
      ...(additionalConfigurations?.modelToViewModel || [])
    );
  }

  // Model to API Model
  if (m && am) {
    createMap(
      mapper,
      m,
      am,
      ...getConfigurations<T, TAm>(resolvers.modelToApiModel),
      ...(additionalConfigurations?.modelToApiModel || [])
    );
  }

  // View Model to API Model
  if (vm && am) {
    createMap(
      mapper,
      vm,
      am,
      ...getConfigurations<TVm, TAm>(resolvers.viewModelToApiModel),
      ...(additionalConfigurations?.viewModelToApiModel || [])
    );
  }
}

export function configureAndCreateMaps<T extends { id: string }, TVm, TAm>(
  mapper: Mapper,
  m: ModelIdentifier<T> | null,
  vm: ModelIdentifier<TVm> | null,
  am: ModelIdentifier<TAm> | null,
  fieldTypes: Partial<Record<keyof T & keyof TVm & keyof TAm, FieldConfig>>,
  additionalConfigurations?: {
    apiModelToModel?: MappingConfiguration<TAm, T>[];
    modelToViewModel?: MappingConfiguration<T, TVm>[];
    modelToApiModel?: MappingConfiguration<T, TAm>[];
    viewModelToApiModel?: MappingConfiguration<TVm, TAm>[];
  }
) {
  const idConfiguration =
    am && m
      ? forMember(
          (d) => d.id,
          mapWithArguments<TAm, T, string>((s, { idMap }) => {
            // Allow a model to be used with or without id
            const id =
              (s as typeof s & Partial<{ id: string }>).id ||
              (idMap as Map<TAm, string>).get(s);

            !id &&
              (() => {
                throw new Error('Id not found for model in idMap');
              })();

            return id;
          })
        )
      : null;

  configureAndCreateMapsInternal(mapper, m, vm, am, fieldTypes, {
    apiModelToModel: [
      ...(additionalConfigurations?.apiModelToModel || []),
      ...(idConfiguration ? [idConfiguration] : []),
    ],
    modelToViewModel: additionalConfigurations?.modelToViewModel,
    modelToApiModel: additionalConfigurations?.modelToApiModel,
    viewModelToApiModel: additionalConfigurations?.viewModelToApiModel,
  });
}

export function configureAndCreateNoneIdMaps<T, TVm, TAm>(
  mapper: Mapper,
  m: ModelIdentifier<T> | null,
  vm: ModelIdentifier<TVm> | null,
  am: ModelIdentifier<TAm> | null,
  fieldTypes: Partial<Record<keyof T & keyof TVm & keyof TAm, FieldConfig>>,
  additionalConfigurations?: {
    apiModelToModel?: MappingConfiguration<TAm, T>[];
    modelToViewModel?: MappingConfiguration<T, TVm>[];
    modelToApiModel?: MappingConfiguration<T, TAm>[];
    viewModelToApiModel?: MappingConfiguration<TVm, TAm>[];
  }
) {
  configureAndCreateMapsInternal(
    mapper,
    m,
    vm,
    am,
    fieldTypes,
    additionalConfigurations
  );
}
