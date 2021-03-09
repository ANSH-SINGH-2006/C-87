import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {Card, Header, Icon} from 'react-native-elements'

export default class ReceiverDetailsScreen extends Component{
    constructor(props){
        super(props)

        this.state={
        
            userId: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam('details')["user_id"],
            requestId: this.props.navigation.getParam('details')["request_id"],
            bookName: this.props.navigation.getParam('details')["book_name"],
            reason_for_requesting: this.props.navigation.getParam('details')["reason_to_request"],
            receiverName: '',
            receiverContact:'',
            receiverAddress: '',
            receiverRequestDocId: '',
            userName: ''
        }
    }

    getReceiverDetails(){
        db.collection('users').where('email_id', '==', this.state.receiverId).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                
                this.setState({
                    receiverName: doc.data().first_name,
                    receiverContact: doc.data().contact,
                    receiverAddress: doc.data().address
                })
            })
            
        })
        
        db.collection('requested_books').where('request_id', '==', this.state.requestId).get().then(snapshot=>{
            snapshot.forEach(doc=>{

                this.setState({
                    receiverRequestDocId: doc.id
                })
            })
            
        })
    }

    getUserDetails=(userId)=>{
        db.collection("users").where('email_id', '==', userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                userName: doc.data().first_name + " "+ doc.data().last_name
            })
        })
    }

    updateBookStatus=()=>{
        db.collection('all_donations').add({
            book_name: this.state.bookName,
            request_id: this.state.requestId,
            requested_by: this.state.receiverName,
            donor_id: this.state.userId,
            request_status: "Donor Is Interested"

        })
    }

    addNotification=()=>{
        var message=this.state.userName + " has shown interest in donating the books!" 

        db.collection('all_notifications').add({
            "targeted_user_id": this.state.receiverId,
            "donor_id": this.state.userId,
            "request_id": this.state.requestId,
            "book_name": this.state.bookName,
            'date': firebase.firestore.FieldValue.serverTimestamp(),
            'notification_status': 'unread',
            'message': message
        })
    }



    componentDidMount(){
        this.getReceiverDetails()
        this.getUserDetails(this.state.userId)
    }

    render(){
        return(
            <View style={StyleSheet.container}>
                <View style={{flex:0.1}}>
                <Header
      leftComponent={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
      centerComponent={{ text: 'donate books', style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
      backgroundColor = "#eaf8fe"
    />
                </View>

                <View style={{flex:0.3}}>
            <Card title={"book information"} titleStyle={{fontSize:20}}>
                <Card>
                    <Text style={{fontWeight:'bold'}}>
                        Name: {this.state.bookName}
                    </Text>
                </Card>

                <Card>
                    <Text style={{fontWeight:'bold'}}>
                        Reason: {this.state.reason_for_requesting}
                    </Text>
                </Card>
            </Card>
                </View>

                <View style={{flex:0.3}}>
            <Card title={"receiver information"} titleStyle={{fontSize:20}}>
                <Card>
                    <Text style={{fontWeight:'bold'}}>
                        Name: {this.state.receiverName}
                    </Text>
                </Card>

                <Card>
                    <Text style={{fontWeight:'bold'}}>
                        Contact: {this.state.receiverContact}
                    </Text>
                </Card>

                <Card>
                    <Text style={{fontWeight:'bold'}}>
                        Address: {this.state.receiverAddress}
                    </Text>
                </Card>
            </Card>
                </View>
                <View style={styles.buttonContainer}>
                    {
                        this.state.receiverId !== this.state.userId
                        ?(
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{
                                this.updateBookStatus()
                                this.addNotification()
                                this.props.navigation.navigate('MyDonations')
                            }}
                            
                            >
                                <Text>
                                    I want to DONATE!
                                </Text>
                            </TouchableOpacity>
                        ):null
                    }
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,

    },

    buttonContainer:{
        flex:0.3,
        justifyContent:'center',
        alignItems:'center'
    },

    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff9800",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        padding: 10
      },

      
})
