# red-ux (in BETA!!)

## performance utilities for progressive web apps.

take your user experience out of the red

---

## React: Reduce unneeded re-rendering with `shouldUpdate`

`shouldUpdate` uses [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) under the hood.

```JS
import React, {Component} from 'react';
import { shouldUpdate } from 'red-ux'

export class List extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return shouldUpdate(nextProps, nextState);
  }

  render() {
    return (
      <ul>{
        this.props.data.map(({name,id}) => <li key={id}>{name}</li>)
      }</ul>)
    }
}
```

---

## Redux: Result caching with `genSelectState`

`genSelectState` uses [Reselect](https://github.com/reactjs/reselect) under the hood.

This function will let you wrap computationally expensive logic.

Example; using React & Redux.

* Without `genSelectState`

```JS
import React, {Component} from 'react';
import { connect } from 'react-redux';

export class List extends Component {

  render() {

    const posts = this.props.posts.map( post => ({ id: post.uid, name:post.userName }) )

    return (
      <ul><li>{this.props.user.name} List</li>{
        posts.map(post => <li key={post.id}>{post.name}</li>)
      }</ul>)
    }
}

const map_state_to_props = (state)=>({
  user  : state.user,
  posts : state.posts
}}

export default connect(map_state_to_props)(List);
```

* With `genSelectState`

```JS
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { genSelectState } from 'red-ux'

export class List extends Component {

  render() {

    return (
      <ul><li>{this.props.user.name} List</li>{
        this.props.posts.map(post => <li key={post.id}>{post.name}</li>)
      }</ul>)
    }
}

const map_state_to_props = (state)=>({
  user  : state.user,
  posts : state.posts
}}

const works = {
  posts : posts => posts.map( post => ({ id: post.uid, name:post.userName }))
}

export default connect(genSelectState( map_state_to_props, works ))(List);
```

Now the transformation will only happen once on each if the reference passed in was the same.
This means that the posts transformation will happen on the first call and will return the same calculated value is the posts have not changed.

### An **alternative api** is available that more closely follows *reselect*

```JS
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { genSelectState } from 'red-ux'

export class List extends Component {

  render() {

    return (
      <ul><li>{this.props.user.name} List</li>{
        this.props.posts.map(post => <li key={post.id}>{post.name}</li>)
      }</ul>)
    }
}

const selecters = {
  user  : state => state.user
  posts : state => state.posts
}

const works = {
  posts : posts => posts.map( post => ({ id: post.uid, name:post.userName }))
}

export default connect(genSelectState( selecter, works ))(List);
```

You pass an `Object` as the first argument to `genSelectState` that maps the to select functions
