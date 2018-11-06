import React, { Component } from 'react'
import { ScrollView, SafeAreaView, View, Text, FlatList, TextInput } from 'react-native'
import withObservables from '@nozbe/with-observables'

import Button from './helpers/Button'
import ListItem from './helpers/ListItem'
import styles from './helpers/styles'

const NastyCommentsItem = ({ blog, onPress }) => (
  <ListItem title="Nasty comments"
    countObservable={blog.nastyComments.observeCount()}
    onPress={onPress} />
)

const RawPostItem = ({ post, onPress }) => (
  <ListItem title={post.title} countObservable={post.comments.observeCount()} onPress={onPress} />
)

const PostItem = withObservables(['post'], ({ post }) => ({
  post: post.observe(),
}))(RawPostItem)

class Blog extends Component {
  moderate = async () => {
    await this.props.blog.moderateAll()
  }
  state = {
    postsCollection: null,
    postTitle: '',
    subtitle: '',
    body: ''
  }
  componentDidMount() {
    try {
      const postsCollection = database.collections.get('posts')
      this.setState((state) => {
        return {postsCollection: postsCollection}
      }, () => {
        console.log('this.state.posts :', this.state.postsCollection);
      })
    } catch (error) {
      console.warn(error)
    }
  }
  addPost = () =>{
    console.log('this.state :', this.state);
    this.state.postsCollection.create((post) => {
      post.title = this.state.postTitle,
      post.body = this.state.body,
      post.subtitle = this.state.subtitle
      post.blog.set(this.props.blog)
    }).then((newPost) => {
      console.log('newPost', newPost)
    })
  }

  render() {
    const { blog, posts, navigation } = this.props
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <TextInput
            style={{height: 40, borderColor: 'blue', borderWidth: 1, margin:5, padding: 0 }}
            onChangeText={(postTitle) => this.setState({postTitle})}
            value={this.state.blogname}
          />
          <TextInput
            style={{height: 40, borderColor: 'blue', borderWidth: 1, margin:5, padding: 0 }}
            onChangeText={(subtitle) => this.setState({subtitle})}
            value={this.state.blogname}
          />
          <TextInput
            style={{height: 40, borderColor: 'blue', borderWidth: 1, margin:5, padding: 0 }}
            onChangeText={(body) => this.setState({body})}
            value={this.state.blogname}
          />
          <Button
            onPress={this.addPost}
            title="发帖"
            color="#841584"
          />
        </SafeAreaView>
        <SafeAreaView style={styles.topPadding}>
          <Button style={styles.button} title="Moderate" onPress={this.moderate} />
          <NastyCommentsItem blog={blog}
            onPress={() => navigation.navigate('ModerationQueue', { blog })} />
          <Text style={styles.postsListHeader}>Posts: {posts.length}</Text>
          <FlatList data={posts}
            renderItem={({ item: post }) => (
              <PostItem post={post}
                key={post.id}
                onPress={() => navigation.navigate('Post', { post })} />
            )} />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

const enhance = withObservables(['blog'], ({ blog }) => ({
  blog: blog.observe(),
  posts: blog.posts.observe(),
}))

export default enhance(Blog)
