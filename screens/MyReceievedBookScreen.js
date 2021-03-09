import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyReceievedBooksScreen extends Component{
  constructor(){
    super()
    this.state = {
      receievedBooksList : [],
      userId: firebase.auth().currentUser.email
    }
  this.requestRef= null
  }

  getReceievedBooksList =()=>{
    this.requestRef = db.collection("requested_books")
    .where('user_id', '==', this.state.userId)
    .where("book_status", '==', 'receieved')
    .onSnapshot((snapshot)=>{
      var receievedBooksList = snapshot.docs.map(document => document.data());
      this.setState({
        receievedBooksList : receievedBooksList
      });
    })
  }

  componentDidMount(){
    this.getReceievedBooksList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.bookStatus}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Receieved Books" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receievedBooksList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Receieved Books</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receievedBooksList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
