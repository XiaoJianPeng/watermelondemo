import { Model } from '@nozbe/watermelondb'
import { field, relation, children, readonly, date } from '@nozbe/watermelondb/decorators'

class Post extends Model {
  static table = 'posts'
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
  
  @field('title')
  title

  @field('subtitle')
  subtitle

  @field('body')
  body

  

  async add({body, title}) {
    const newPost = await postsCollection.create(post => {
      post.title = title
      post.body = body
    })
    return newPost
  }
}

// class Comments extends Model {
//   static table = 'comments'
//   static associations = {
//     posts: { type: 'belongs_to', key: 'post_id' },
//   }
//   @readonly @date('created_at') createdAt
//   @readonly @date('updated_at') updatedAt
//   @field('body') body
//   @field('post_id') post_id
// }

export {
  Post,
  // Comments
}