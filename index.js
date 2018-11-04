/** @format */

import {AppRegistry} from 'react-native';
import { createNavigation } from './src/components/helpers/Navigation'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import Blog from './src/models/Blog'
import Post from './src/models/Post'
import Comment from './src/models/Comment'
import { mySchema } from './src/models/schema'
// import App from './App';
import {name as appName} from './app.json';

const adapter = new SQLiteAdapter({
  dbName: 'WatermelonDemo',
  schema: mySchema,
})

const database = new Database({
  adapter,
  modelClasses: [Blog, Post, Comment],
})


const Navigation = createNavigation({ database })

AppRegistry.registerComponent(appName, () => Navigation);
