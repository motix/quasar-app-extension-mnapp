| Field                           | Model                    | View Model               | API Model                |
|---------------------------------|--------------------------|--------------------------|--------------------------|
| id                              | string                   | ?: string                | -                        |
| id (no create action)           | string                   | string                   | -                        |
| string                          | string                   | string                   | string                   |
| optional string                 | ?: string                | string \| null           | ?: string \| null        |
| - required when save            |                          |                          | ?: string                |
| boolean                         | boolean                  | boolean                  | boolean                  |
| optional boolean                | ?: boolean               | boolean \| null          | ?: boolean \| null       |
| - required when save            |                          |                          | ?: boolean               |
| number                          | number                   | number \| string         | number                   |
| optional number                 | ?: number                | number \| string \| null | ?: number \| null        |
| - required when save            |                          |                          | ?: number                |
| date                            | Date                     | string                   | Timestamp                |
| optional date                   | ?: Date                  | string \| null           | ?: Timestamp \| null     |
| - required when save            |                          |                          | ?: Timestamp             |
| required, auto generated client | string                   | ?: string                | string                   |
| required, auto generated server | string                   | ?: string                | ?: string                |
