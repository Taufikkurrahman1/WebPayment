/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  ToastAndroid,
  Button,
  Alert,
  WebView,
  ActivityIndicator
} from 'react-native';

import './shim.js';
import { newOrder } from './payU';
const uuid = require('react-native-uuid');

import WebPage from './component/WebPage'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component {

  constructor(){
    super()
    this.state ={
      modalVisible: false,
      params: null,
      activity: false,
    }
  }
  onClose =() =>{
    this.setState({modalVisible: false});
  }

  onNavStateChange =(redirect)=> {
    console.log(redirect);
    if(redirect.url === "https://www.google.com/_success"){
      this.setState({ modalVisible: false, params:null,activity:false});
      alert("Payment Success :-)");
    }
    if(redirect.url === "https://www.google.com/_failure"|| redirect.url === "https://test.cap.attempts.securecode.com/acspage/cap?RID=1&VAA=A"){
      this.setState({ modalVisible: false, params:null,activity:false});
      alert("Payment Failure :-(");
    }

  }

  onPay =()=> {
    this.setState({activity:true})
    newOrder.Create({amount: Math.floor(Math.random() * 10 + 1).toString(16),
      productinfo: "productinfo",
      firstname: "firstname",
      email: "email@gmail.com",
      phone: "+91-9876543210",
      surl: 'https://www.google.com/_success',
      furl: 'https://www.google.com/_failure',
      service_provider: 'payuBiz',
      txnid: uuid.v4(),
      }, false);

      newOrder.sendReq()
      .then(Response => {
            if(Response.url != "https://test.payu.in/_payment"){
              ToastAndroid.show('Payment Request Success!!', ToastAndroid.SHORT);                
              this.setState({modalVisible: true, params:Response ,activity:false});
            } else{
              ToastAndroid.show('Payment Request Failed!!', ToastAndroid.SHORT);
              this.setState({activity:false});
            }
        })
        .catch(err => {
            console.log(err);
        });
  }
  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          Web Payment Gateway!
        </Text>
        {this.state.activity?
        (<ActivityIndicator size="large" color="#0000ff" animating={this.state.activity} />):(<Button
          onPress={this.onPay}
          title="Go to Random Payment Page"
        />)}
        
        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.onClose()}>
          <View style={{flex:1, justifyContent:'center'}}>            
          {(
          this.state.params 
          ? (<WebPage
              link={this.state.params.url}
              onNavigationStateChange = {this.onNavStateChange}/>)
          : null
          )}
          </View>
      </Modal>
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
