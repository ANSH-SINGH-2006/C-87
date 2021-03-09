import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyDonationScreen extends Component{
    
    static navigationOptions={Header:null}
  constructor(){
    super()
    this.state = {
      allDonations : [],
      donorId: firebase.auth().currentUser.email,
      donorName: ''
    }
  this.requestRef= null
  }

  getDonorDetails=(donorId)=>{
    db.collection("users").where('email_id', '==', donorId).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            donorName: doc.data().first_name + " "+ doc.data().last_name
        })
    })
}

  getAllDonations =()=>{
    this.requestRef = db.collection("all_donations").where("donor_id", '==', this.state.donorId)
    .onSnapshot((snapshot)=>{
      var allDonations=[]
      snapshot.docs.map((doc)=>{
          var donation= doc.data()
          donation['doc_id']=doc.id
          allDonations.push(donation)
      })
      this.setState({
        allDonations : allDonations
      });
    })
  }

  sendBook=(bookDetails)=>{
    
    if(bookDetails.request_status==="Book Sent"){
      var requestStatus="Donor Interested"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status": "Donor Interested"
      })

      this.sendNotification(bookDetails, requestStatus)
    }

    else{
      var requestStatus="Book Sent"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status": "Book Sent"
      })

      this.sendNotification(bookDetails, requestStatus)
    }

  }

  sendNotification=(bookDetails, requestStatus)=>{

  var requestId=bookDetails.request_id
  var donorId= bookDetails.donor_id
  db.collection("all_notifications").where("request_id", "==", requestId).where("donor_id", "==", donorId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var message=""
      if(requestStatus==="Book Sent"){
        message=this.state.donorName+" Sent you a book"
      }
      else{
        message=this.state.donorName+" has shown interest in donating the book"
      }

      db.collection("all_notifications").doc(doc.id).update({
        "message": message,
        "notification_status": "unread",
        "date": firebase.firestore.FieldValue.serverTimestamp()
        
      })
      
    })
  })
  }

  componentDidMount(){
    this.getAllDonations()
    this.getDonorDetails(this.state.donorId)
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
        subtitle={"requested by: "+ item.requested_by+ "\n status: "+ item.request_status }
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={[styles.button, {backgroundColor: item.request_status==="Book Sent" ? "green":"red"}]}
            onPress={()=>{
              this.sendBook(item)
            }}>
              <Text style={{color: 'white'}}>
                {
                  item.request_status==="Book Sent"? "Book Send":"Send Book"
                }
              </Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="My Donations" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allDonations.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of Donated Books</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
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
