/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, FlatList} from 'react-native';
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './src/model/schema'
import Post from './src/models/Post'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

// const adapter = new SQLiteAdapter({
//   dbName: 'myAwesomeApp', // ⬅️ Give your database a name!
//   schema: mySchema,
// })

// global.database = new Database({
//   adapter,
//   modelClasses: [
//     Post,
//     // Post, // ⬅️ You'll add Models to Watermelon here
//   ],
// })
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postsCollection: null,
      list: []
    }
  }
  componentDidMount() {
    console.log(1)
    try {
      const postsCollection = database.collections.get('posts')
      this.setState((state) => {
        return {postsCollection: postsCollection}
      }, () => {
        console.log('this.state.posts :', this.state.postsCollection);
        this.queryList()
      })
    } catch (error) {
      console.warn(error)
    }
   
  }

  queryList = () => {
    this.state.postsCollection.query().fetch().then((res) => {
      res = res.map((item) => {
        return item
      })
      console.log(res)
      this.setState({list: res}, () => {
        
      })
    })
  }

  onPressLearnMore = () =>{
    const data = {
      title: 'new Title' + new Date().getTime(),
      body: '重卡深蓝色佛爱好U盾哇哈u' + new Date().toDateString(),
      subtitle: '子标题'
    }
    this.state.postsCollection.create((post) => {
      for(const key in data) {
        console.log('key', key)
        post[key] = data[key]
      }
    }).then((newPost) => {
      console.log('newPost', newPost)
      this.queryList()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button
          onPress={this.onPressLearnMore}
          title="添加一条数据"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <FlatList
          data={this.state.list}
          renderItem={({item}) => <Text style={styles.item}>{item.title}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
