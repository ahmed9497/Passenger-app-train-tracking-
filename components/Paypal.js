
import React, { Component } from 'react';
import {
    Image,
    Text, TouchableOpacity, FlatList, BackHandler,
    BackHandlerBackHandler, TouchableHighlight, ListItem, RefreshControl,ScrollView,WebView,Modal,
    View, StatusBar, FlatListItem, StyleSheet, style, ActivityIndicator, ToastAndroid, BackAndroid,
} from 'react-native';
import firebase from 'react-native-firebase';
import { Card, Button, Divider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import { Picker, Item } from 'native-base';
import {getDistance} from 'geolib';


const ro_id ='';

export {ro_id};




 const shippingname ='';
export default class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            count :true,modalVisible:true,
            t_r_id:this.props.navigation.state.params.t_r_id,
            totalseats: this.props.navigation.state.params.total,
            datee:this.props.navigation.state.params.date,
            myseats:this.props.navigation.state.params.myseats,
            fare : this.props.navigation.state.params.fare,
            t_id:this.props.navigation.state.params.t_id,
            r_id :this.props.navigation.state.params.route_id,
            link:'',id:'',
            Address:'',Cnic:'',ContactNo:'',Penalties:[],date:'',name:'',panlitiespayment:[],route_id:'',seats:[],
            status:'',tracking_id:'',train_id:'',userid:'',email:'',
            slat: this.props.navigation.state.params.slat,
            slng: this.props.navigation.state.params.slng,
            dlat: this.props.navigation.state.params.dlat,
            dlng: this.props.navigation.state.params.dlng,
            p_doc_id:'',
            source :this.props.navigation.state.params.source,
            destination:this.props.navigation.state.params.destination

        };
       
        
        
        

        console.log(this.state.fare);
        this._isMounted = true;
       
        ro_id = this.state.r_id;
        this.reg = firebase.firestore().collection('ticketreservedpassengers');
        this.referss = firebase.firestore().collection('route');
        this.pass= firebase.firestore().collection('passengers');
        const {uid} =firebase.auth().currentUser;

if (this._isMounted){
       this.pass.doc(uid).onSnapshot(query=>{
         //   console.log(query.data());
            shippingname=query.data().name,

            this.setState({
                Address:query.data().address,
                Cnic:query.data().cnic,
                ContactNo:query.data().contact,
                // Penalties:'',
                // date:'',
                name:query.data().name,
               
                route_id:this.state.r_id,
                seats:this.state.myseats,
                // status:'',
                // tracking_id:'',
                // train_id:'',
                email:query.data().email,
                userid:query.data().userid



            });
          

            // console.log(this.state.name);
            // console.log(shippingname);
           // this.add();
          
        });
      }



        
        
    }
    componentWillUnmount(){
      this.referss=null;
      this.pass=null;
      this.reg =null;
      this.getMoviesFromApi = null;
     this._isMounted = false ;
    }

    componentDidMount(){
        
      if (this._isMounted){
        this.getMoviesFromApi(); 
      }
    
       
    }
    add_route =()=>{
      this.setState({ modalVisible: false })
      console.log(this.state.datee +"  "+ this.state.t_id);
      aq = true;
      this.referss.where('date','==',this.state.datee).where('train_id','==',this.state.t_id).onSnapshot(query => {
        console.log(query.empty);
        
        if(query.empty){
          aq=false;
         // console.log("if is called");
          this.referss.add ({

            date : this.state.datee,
            driver_id :'',
            food: [],
            id:'',
            kitchenrunner_id: '',
            notification:[],
            reserved_seats:this.state.totalseats,
            ticketchecker_id:'',
            train_id:this.state.t_id,
            trainroute_id:this.state.t_r_id,


          }).then(doc =>{
           
            console.log("Datas is route");
            console.log(doc.id);
             console.log("then is running");
             console.log(this.state.p_doc_id);
            this.referss.doc(doc.id).update({
              id:doc.id
            });
            this.reg.doc(this.state.p_doc_id).update({
              route_id:doc.id
            });
            this.reg.doc(this.state.p_doc_id).onSnapshot(d=>{
              console.log(d);

            })
            
           
            this.props.navigation.navigate('Home1');
          });
          ToastAndroid.show("new Route added with id",ToastAndroid.LONG);
         //
        }
        if (aq && !query.empty) {
          console.log("elese is called");
          this.referss.doc(this.state.r_id).update({
            reserved_seats : this.state.totalseats
    
          });
        
          ToastAndroid.show(' only route updated',ToastAndroid.LONG);
         
          this.props.navigation.navigate('Home1');

        }


       // this.props.navigation.navigate('Home1');
       //query.forEach
     
    })
  }
   
    add=()=>{

        const ran =Math.random().toString(33).substring(2, 10);
        this.reg.add({

            Address:this.state.Address,
            Cnic:this.state.Cnic,
            ContactNo:this.state.ContactNo,
            Penalties:this.state.Penalties,
            date:this.state.datee,
            name:this.state.name,
            panlitiespayment:this.state.panlitiespayment,
            route_id:this.state.route_id,
            seats:this.state.seats,
            status:'',
            tracking_id:ran,
            train_id:this.state.t_id,
            email:this.state.email,
            userid:this.state.userid,
            slat:this.state.slat,
            slng:this.state.slng,
            dlat:this.state.dlat,
            dlng:this.state.dlng,
           // fare :this.state.fare * this.state.myseats.length,
           fare :this.state.fare, 
           source :this.state.source,
            destination:this.state.destination

        }).then(data=>{
        //  console.log(data.id);
          this.setState({p_doc_id:data.id})
        //  console.log(this.state.p_doc_id);
        })

        alert('success');
    }


    hide () {
 if(this._isMounted){
      this.setState({ modalVisible: false })
     
    }
    }
    async getMoviesFromApi() {
        const d =this.state.fare+".00";
        const ran =Math.random().toString(31).substring(2, 8);
       // const n =`${this.state.name}`
        //console.log(n);
        const name = shippingname;
        try {
          let response = await fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
            method: 'POST',
            headers: {
                'Accept' :'application/json',
              'Authorization': 'Bearer A21AAEezRAQpQ4b1U_Lf_JC0XvdVK4FFFcGkS-0xNXC6qqYkasEtFZFfUHV1S1LbkyrCuCG6Jy170EwlU_A0FBD4UDh0TitAA',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                
                
                    "intent": "sale",
                    "payer": {
                      "payment_method": "paypal"
                    },
                    "transactions": [
                      {
                        "amount": {
                          "total": d,
                          "currency": "USD",
                          "details": {
                            "subtotal": d,
                            "tax": "0.00",
                            "shipping": "0.00",
                            "handling_fee": "0.00",
                            "shipping_discount": "0.00",
                            "insurance": "0.00"
                          }
                        },
                        "description": "The payment for seats.",
                        "custom": "EBAY_EMS_94210243335",
                        "invoice_number": ran,
                        "payment_options": {
                          "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
                        },
                        "soft_descriptor": "ECHI4852",
                        "item_list": {
                          "items": [
                            {
                              "name": "Your seats",
                              "description": "door seat.",
                              "quantity": "1",
                              "price": d,
                              "tax": "0.00",
                              "sku": "product2",
                              "currency": "USD"
                            }
                            
                          ],
                          "shipping_address": {
                            "recipient_name": name,
                            "line1": "9th Floor",
                            "line2": "Unit #32",
                            "city": "San Jose",
                            "country_code": "US",
                            "postal_code": "95121",
                            "phone": "011862217845678",
                            "state": "CA"
                          }
                        }
                      }
                    ],
                    "note_to_payer": "Contact us for any questions on your order.",
                    "redirect_urls": {
                      "return_url": "https://example.com/return",
                      "cancel_url": "https://example.com/cancel"
                    }
                  
                  
            }),
          })
          
         
          let responseJson = await response.json();
          console.log(responseJson);
          this.setState({link:responseJson.links[1].href,id:responseJson.id});
          console.log(this.state.link);
          console.log(this.state.id);
          return responseJson;
        } catch (error) {
          console.error(error);
        }
      }



      async payment(payer){
   if(this._isMounted){
        try {
          let response = await fetch('https://api.sandbox.paypal.com/v1/payments/payment/'+this.state.id+'/execute', {
            method: 'POST',
            headers: {
                'Accept' :'application/json',
              'Authorization': 'Bearer A21AAEezRAQpQ4b1U_Lf_JC0XvdVK4FFFcGkS-0xNXC6qqYkasEtFZFfUHV1S1LbkyrCuCG6Jy170EwlU_A0FBD4UDh0TitAA',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                
              
                "payer_id": payer
              
               
          })
        })
          
          let responseJson = await response.json();
          console.log(responseJson);
         
           return responseJson;
        } catch (error) {
          console.error(error);
        }
      
      }
    }
  
      


      _onNavigationStateChange =(webstate)=> {
     
        console.log(webstate.url);
        if (webstate != null || webstate.url != 'about:blank') {
          console.log("search params");
          try {
        var urlParams = new URLSearchParams(webstate.url);
        const payer_id = urlParams.get('PayerID');
        console.log(payer_id);
       
        if (payer_id !=null && this.state.count){
        let paid = this.payment(payer_id);
        console.log(paid);
          this.state.count =false;
          if(paid != null){
          
           this.add();
          // this.hide();
           this.add_route();
           // alert('Paid');

          }
          
   
   
        }
      }catch (error) {
        console.error(error);
      }
    }
       }  
    
    render() {
     
        

const {uid} =firebase.auth().currentUser;
const { navigate } = this.props.navigation;
const { params } = this.props.navigation;
return (
  <Modal
  animationType={'slide'}
  visible={this.state.modalVisible}
  onRequestClose={this.hide.bind(this)}
  transparent
>
<View style={styles.container}>
    <WebView
    source={{uri: this.state.link}}
      style={{marginTop: 20}}
      onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          javaScriptEnabled = {true}
          domStorageEnabled = {true}
          injectedJavaScript = {this.state.cookie}
          startInLoadingState={false}
         onLoadEnd={this.home}
         BackAndroid={true}
         BackHandler={true}
/>
</View>
        </Modal>

          
       
    
    )
}

}    



const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'gray',


    },
    contentContainer: {
        //paddingVertical: 50,
    },
    btnstyle :{
        backgroundColor: "rgba(92, 99,216, 1)",
        width: 300,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 100
    },
    list: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingBottom: 20,

    },
    listcontainer: {
        width: '80%',
        backgroundColor: 'blue'
    },
    Iconlist: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
    }

});