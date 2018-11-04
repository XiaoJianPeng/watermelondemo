import React, { Component } from 'react'
import { ScrollView, SafeAreaView, Alert, Text, View, Image, TextInput } from 'react-native'

import Button from './helpers/Button'
import styles from './helpers/styles'
import BlogList from './BlogList'

class Root extends Component {
  state = {
    isGenerating: false,
    blogname:''
  }
  

  add = () =>{
    const data = {
      name: this.state.blogname
    }
    const blogsCollection = this.props.database.collections.get('blogs')
    blogsCollection.create((blog) => {
      for(const key in data) {
        console.log('key', key)
        blog[key] = data[key]
      }
    }).then((newBlog) => {
      console.log('newBlog', newBlog)
    })
  }

  render() {
    return (
      <ScrollView>
        <SafeAreaView>
          <View style={{margin:10}}>
            <TextInput
              style={{height: 40, borderColor: 'blue', borderWidth: 1, margin:5, padding: 0 }}
              onChangeText={(blogname) => this.setState({blogname})}
              value={this.state.blogname}
            />
            <Button
              onPress={this.add}
              title="添加博客"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
          <View style={styles.marginContainer}>
            <Text style={styles.header}>博客列表</Text>
          </View>
          {!this.state.isGenerating && (
            <BlogList database={this.props.database} navigation={this.props.navigation} />
          )}
        </SafeAreaView>
      </ScrollView>
    )
  }
}

export default Root
