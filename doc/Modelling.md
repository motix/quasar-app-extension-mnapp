| Field                           | Model      | View Model               | API Model            | Configure            |
| ------------------------------- | ---------- | ------------------------ | -------------------- | -------------------- |
| id                              | string     | ?: string                | -                    | -                    |
| id (no create action)           | string     | string                   | -                    | -                    |
| string                          | string     | string                   | string               | -                    |
| optional string                 | ?: string  | string \| null           | ?: string \| null    | x                    |
| - required when save            |            |                          | ?: string            | x                    |
| boolean                         | boolean    | boolean                  | boolean              | -                    |
| optional boolean                | ?: boolean | boolean \| null          | ?: boolean \| null   | x                    |
| - required when save            |            |                          | ?: boolean           | x                    |
| number                          | number     | number \| string         | number               | x                    |
| - optional when edit            |            | number \| string \| null |                      | x as number required |
| readonly number                 | number     | number                   | number               | -                    |
| optional number                 | ?: number  | number \| string \| null | ?: number \| null    | x                    |
| - required when save            |            |                          | ?: number            | x                    |
| date                            | Date       | string                   | Timestamp            | x                    |
| optional date                   | ?: Date    | string \| null           | ?: Timestamp \| null | x                    |
| - required when save            |            |                          | ?: Timestamp         | x                    |
| required, auto generated client | string     | ?: string                | string               | x                    |
| required, auto generated server | string     | ?: string                | ?: string            | x                    |
| asIs                            | asIsM      | ?: asIsM                 | asIsM                | x                    |
| readonly asIs                   | asIsM      | asIsM                    | asIsM                | x                    |
| optional asIs                   | ?: asIsM   | asIsM \| null            | ?: asIsM \| null     | x                    |
| - required when save            |            |                          | ?: asIsM             | x                    |
