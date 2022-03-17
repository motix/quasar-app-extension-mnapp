import { CreateMapFluentFunction, mapFrom, mapWithArguments, Resolver } from '@automapper/core'

import { date } from 'quasar'

import { requiredConfigEntries } from 'composables/useConfig'

export interface DateDataConverter {
  fromDate: <T>(date: Date) => T;
  toDate: <T>(data: T) => Date;
}

const {
  editDateFormat,
  dateDataConverter
} = requiredConfigEntries(
  'editDateFormat',
  'dateDataConverter'
)

type HasProp<Key extends string, T> = Record<Key, T>

const apiModelToModelResolver = {
  dateRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, DateDataType>
  > (key: Key) {
    return {
      resolve: (source: TSource): Date => dateDataConverter.toDate<DateDataType>(source[key])
    }
  },

  asIsRequired: function <
    Key extends string,
    Type,
    TSource extends HasProp<Key, Type>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type => source[key]
    }
  },

  optional: function <
    Key extends string,
    Type extends string | boolean | number,
    TSource extends Partial<HasProp<Key, Type | null>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type | undefined => source[key]?.valueOf() as Type | undefined
    }
  },

  dateOptional: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, DateDataType | null>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Date | undefined => {
        const field: DateDataType | null | undefined = source[key]
        return field == null
          ? undefined
          : dateDataConverter.toDate(field)
      }
    }
  },

  asIsOptional: function <
    Key extends string,
    Type,
    TSource extends Partial<HasProp<Key, Type | null>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type | undefined => {
        const field: Type | null | undefined = source[key]
        return field == null ? undefined : field
      }
    }
  }
}

const modelToViewModelResolver = {
  dateRequired: function <
    Key extends string,
    TSource extends HasProp<Key, Date>
  > (key: Key) {
    return {
      resolve: (source: TSource): string => date.formatDate(source[key], editDateFormat)
    }
  },

  asIsRequired: function <
    Key extends string,
    Type,
    TSource extends HasProp<Key, Type>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type => source[key]
    }
  },

  stringOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, string>>
  > (key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key]
        return field === undefined ? '' : field
      }
    }
  },

  booleanOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, boolean>>
  > (key: Key) {
    return {
      resolve: (source: TSource): boolean | null => {
        const field = source[key]
        return field === undefined ? null : field
      }
    }
  },

  numberOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, number>>
  > (key: Key) {
    return {
      resolve: (source: TSource): number | '' => {
        const field = source[key]
        return field === undefined ? '' : field
      }
    }
  },

  dateOptional: function <
    Key extends string,
    TSource extends Partial<HasProp<Key, Date>>
  > (key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key]
        return field === undefined ? '' : date.formatDate(field, editDateFormat)
      }
    }
  }
}

const modelToApiModelResolver = {
  dateRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, Date>
  > (key: Key) {
    return {
      resolve: (source: TSource): DateDataType => dateDataConverter.fromDate(source[key])
    }
  },

  asIsRequired: function <
    Key extends string,
    Type,
    TSource extends HasProp<Key, Type>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type => source[key]
    }
  },

  optional: function <
    Key extends string,
    Type extends string | boolean | number,
    TSource extends Partial<HasProp<Key, Type>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type | null => {
        const field: Type | undefined = source[key]
        return field === undefined ? null : field
      }
    }
  },

  readOptionalWriteRequired: function <
    Key extends string,
    Type extends string | boolean | number,
    TSource extends Partial<HasProp<Key, Type>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type => {
        const field: Type | undefined = source[key]
        field === undefined && (() => { throw new Error(`${key} is required for saving`) })()
        return field
      }
    }
  },

  dateOptional: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, Date>>
  > (key: Key) {
    return {
      resolve: (source: TSource): DateDataType | null => {
        const field = source[key]
        return field === undefined ? null : dateDataConverter.fromDate<DateDataType>(field)
      }
    }
  },

  dateReadOptionalWriteRequired: function <
    Key extends string,
    DateDataType,
    TSource extends Partial<HasProp<Key, Date>>
  > (key: Key) {
    return {
      resolve: (source: TSource): DateDataType => {
        const field = source[key]
        field === undefined && (() => { throw new Error(`${key} is required for saving`) })()
        return dateDataConverter.fromDate(field)
      }
    }
  },

  asIsOptional: function <
    Key extends string,
    Type,
    TSource extends Partial<HasProp<Key, Type>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type | null => {
        const field: Type | undefined = source[key]
        return field === undefined ? null : field
      }
    }
  }
}

const viewModelToApiModelResolver = {
  stringRequired: function <
    Key extends string,
    TSource extends HasProp<Key, string>
  > (key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key]
        field === '' && (() => { throw new Error(`${key} is required for saving`) })()
        return field
      }
    }
  },

  numberRequired: function <
    Key extends string,
    TSource extends HasProp<Key, number | string>
  > (key: Key) {
    return {
      resolve: (source: TSource): number => {
        const field = source[key]
        typeof field === 'string' && field !== '' && (() => { throw new Error(`${key} has invalid string value '${field}'`) })()
        field === '' && (() => { throw new Error(`${key} is required`) })()
        return field
      }
    }
  },

  dateRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string>
  > (key: Key) {
    return {
      resolve: (source: TSource): DateDataType => dateDataConverter.fromDate(date.extractDate(source[key], editDateFormat))
    }
  },

  asIsRequired: function <
    Key extends string,
    Type,
    TSource extends Partial<HasProp<Key, Type>>
  > (key: Key) {
    return {
      resolve: (source: TSource): Type => {
        const field: Type | undefined = source[key]
        field === undefined && (() => { throw new Error(`${key} is required`) })()
        return field
      }
    }
  },

  stringOptional: function <
    Key extends string,
    TSource extends HasProp<Key, string | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): string | null => {
        const field = source[key]
        return field === '' ? null : field
      }
    }
  },

  stringReadOptionalWriteRequired: function <
    Key extends string,
    TSource extends HasProp<Key, string | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): string => {
        const field = source[key];
        (field === '' || field === null) && (() => { throw new Error(`${key} is required for saving`) })()
        return field
      }
    }
  },

  booleanReadOptionalWriteRequired: function <
    Key extends string,
    TSource extends HasProp<Key, boolean | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): boolean => {
        const field = source[key]
        field === null && (() => { throw new Error(`${key} is required for saving`) })()
        return field
      }
    }
  },

  numberOptional: function <
    Key extends string,
    TSource extends HasProp<Key, number | string | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): number | null => {
        const field = source[key]
        typeof field === 'string' && field !== '' && (() => { throw new Error(`${key} has invalid string value '${field}'`) })()
        return field === '' ? null : field
      }
    }
  },

  numberReadOptionalWriteRequired: function <
    Key extends string,
    TSource extends HasProp<Key, number | string | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): number => {
        const field = source[key]
        typeof field === 'string' && field !== '' && (() => { throw new Error(`${key} has invalid string value '${field}'`) })();
        (field === '' || field === null) && (() => { throw new Error(`${key} is required for saving`) })()
        return field
      }
    }
  },

  dateOptional: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): DateDataType | null => {
        const field = source[key]
        return field === '' || field === null
          ? null
          : dateDataConverter.fromDate<DateDataType>(date.extractDate(field, editDateFormat))
      }
    }
  },

  dateReadOptionalWriteRequired: function <
    Key extends string,
    DateDataType,
    TSource extends HasProp<Key, string | null>
  > (key: Key) {
    return {
      resolve: (source: TSource): DateDataType => {
        const field = source[key];
        (field === '' || field === null) && (() => { throw new Error(`${key} is required for saving`) })()
        return dateDataConverter.fromDate(date.extractDate(field, editDateFormat))
      }
    }
  }
}

type DataType = 'string' | 'boolean' | 'number' | 'date' | 'asIs'
type FieldType = 'required' | 'optional' | 'readOptionalWriteRequired'

type ResolverDataTypes = Partial<Record<DataType, (fieldName: string) => Resolver>>
type ResolverFieldTypes = Record<FieldType, ResolverDataTypes>
type Resolvers = {
  apiModelToModel: ResolverFieldTypes;
  modelToViewModel: ResolverFieldTypes;
  modelToApiModel: ResolverFieldTypes;
  viewModelToApiModel: ResolverFieldTypes;
}

const resolvers :Resolvers = {
  apiModelToModel: {
    required: {
      string: undefined,
      boolean: undefined,
      number: undefined,
      date: apiModelToModelResolver.dateRequired,
      asIs: apiModelToModelResolver.asIsRequired
    },
    optional: {
      string: apiModelToModelResolver.optional,
      boolean: apiModelToModelResolver.optional,
      number: apiModelToModelResolver.optional,
      date: apiModelToModelResolver.dateOptional,
      asIs: apiModelToModelResolver.asIsOptional
    },
    readOptionalWriteRequired: {
      string: apiModelToModelResolver.optional,
      boolean: apiModelToModelResolver.optional,
      number: apiModelToModelResolver.optional,
      date: apiModelToModelResolver.dateOptional,
      asIs: undefined // TODO:
    }
  },
  modelToViewModel: {
    required: {
      string: undefined,
      boolean: undefined,
      number: undefined,
      date: modelToViewModelResolver.dateRequired,
      asIs: modelToViewModelResolver.asIsRequired
    },
    optional: {
      string: modelToViewModelResolver.stringOptional,
      boolean: modelToViewModelResolver.booleanOptional,
      number: modelToViewModelResolver.numberOptional,
      date: modelToViewModelResolver.dateOptional,
      asIs: undefined // TODO:
    },
    readOptionalWriteRequired: {
      string: modelToViewModelResolver.stringOptional,
      boolean: modelToViewModelResolver.booleanOptional,
      number: modelToViewModelResolver.numberOptional,
      date: modelToViewModelResolver.dateOptional,
      asIs: undefined // TODO:
    }
  },
  modelToApiModel: {
    required: {
      string: undefined,
      boolean: undefined,
      number: undefined,
      date: modelToApiModelResolver.dateRequired,
      asIs: modelToApiModelResolver.asIsRequired
    },
    optional: {
      string: modelToApiModelResolver.optional,
      boolean: modelToApiModelResolver.optional,
      number: modelToApiModelResolver.optional,
      date: modelToApiModelResolver.dateOptional,
      asIs: modelToApiModelResolver.asIsOptional
    },
    readOptionalWriteRequired: {
      string: modelToApiModelResolver.readOptionalWriteRequired,
      boolean: modelToApiModelResolver.readOptionalWriteRequired,
      number: modelToApiModelResolver.readOptionalWriteRequired,
      date: modelToApiModelResolver.dateReadOptionalWriteRequired,
      asIs: undefined // TODO:
    }
  },
  viewModelToApiModel: {
    required: {
      string: viewModelToApiModelResolver.stringRequired,
      boolean: undefined,
      number: viewModelToApiModelResolver.numberRequired,
      date: viewModelToApiModelResolver.dateRequired,
      asIs: viewModelToApiModelResolver.asIsRequired
    },
    optional: {
      string: viewModelToApiModelResolver.stringOptional,
      boolean: undefined,
      number: viewModelToApiModelResolver.numberOptional,
      date: viewModelToApiModelResolver.dateOptional,
      asIs: undefined // TODO:
    },
    readOptionalWriteRequired: {
      string: viewModelToApiModelResolver.stringReadOptionalWriteRequired,
      boolean: viewModelToApiModelResolver.booleanReadOptionalWriteRequired,
      number: viewModelToApiModelResolver.numberReadOptionalWriteRequired,
      date: viewModelToApiModelResolver.dateReadOptionalWriteRequired,
      asIs: undefined // TODO:
    }
  }
}

export type FieldConfig = {
  dataType: DataType;
  fieldType: FieldType;
}

export function configureMembers<T extends { id: string }, TVm, TAm> (
  apiModelToModelMapper: CreateMapFluentFunction<TAm, T> | null,
  modelToViewModelMapper: CreateMapFluentFunction<T, TVm> | null,
  modelToApiModelMapper: CreateMapFluentFunction<T, TAm> | null,
  viewModelToApiModelMapper: CreateMapFluentFunction<TVm, TAm> | null,
  fieldTypes: Partial<Record<keyof T & keyof TVm & keyof TAm, FieldConfig>>
) {
  apiModelToModelMapper && apiModelToModelMapper
    .forMember(d => d.id,
      mapWithArguments<TAm, T, string>(
        (s, { idMap }) => {
          const id = (idMap as Map<TAm, string>).get(s)

          !id && (() => { throw new Error('Id not found for model in idMap') })()

          return id
        }
      )
    )

  configureNoneIdMembers(
    apiModelToModelMapper,
    modelToViewModelMapper,
    modelToApiModelMapper,
    viewModelToApiModelMapper,
    fieldTypes
  )
}

export function configureNoneIdMembers<T, TVm, TAm> (
  apiModelToModelMapper: CreateMapFluentFunction<TAm, T> | null,
  modelToViewModelMapper: CreateMapFluentFunction<T, TVm> | null,
  modelToApiModelMapper: CreateMapFluentFunction<T, TAm> | null,
  viewModelToApiModelMapper: CreateMapFluentFunction<TVm, TAm> | null,
  fieldTypes: Partial<Record<keyof T & keyof TVm & keyof TAm, FieldConfig>>
) {
  let fieldName: Extract<keyof T & keyof TVm & keyof TAm, string>

  for (fieldName in fieldTypes) {
    const config = fieldTypes[fieldName]
    if (config) {
      if (apiModelToModelMapper) {
        const method = resolvers.apiModelToModel[config.fieldType][config.dataType]
        !!method && apiModelToModelMapper.forMember(d => d[fieldName], mapFrom(method(fieldName)))
      }

      if (modelToViewModelMapper) {
        const method = resolvers.modelToViewModel[config.fieldType][config.dataType]
        !!method && modelToViewModelMapper.forMember(d => d[fieldName], mapFrom(method(fieldName)))
      }

      if (modelToApiModelMapper) {
        const method = resolvers.modelToApiModel[config.fieldType][config.dataType]
        !!method && modelToApiModelMapper.forMember(d => d[fieldName], mapFrom(method(fieldName)))
      }

      if (viewModelToApiModelMapper) {
        const method = resolvers.viewModelToApiModel[config.fieldType][config.dataType]
        !!method && viewModelToApiModelMapper.forMember(d => d[fieldName], mapFrom(method(fieldName)))
      }
    }
  }
}
