import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    // tableSchemas go here...
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'blog_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    // tableSchema({
    //   name: 'comments',
    //   columns: [
    //     { name: 'body', type: 'string' },
    //     { name: 'post_id', type: 'string', isIndexed: true },
    //     { name: 'created_at', type: 'number' },
    //     { name: 'updated_at', type: 'number' },
    //   ]
    // }),
  ]
})