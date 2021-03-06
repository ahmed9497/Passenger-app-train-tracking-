
import React, { Component } from 'react';
import {
    Image,
    Text, TouchableOpacity, FlatList, BackHandler,
    BackHandlerBackHandler, TouchableHighlight, ListItem, RefreshControl,ScrollView,
    View, StatusBar, FlatListItem, StyleSheet, style, ActivityIndicator, ToastAndroid, BackAndroid,
} from 'react-native';
import firebase from 'react-native-firebase';
import { Card, Button, Divider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import { Picker, Item } from 'native-base';
import {getDistance} from 'geolib';

export default class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            //totalseats: this.props.navigation.state.params.total,
            stationData:[],selected1:'',loading:true,
            train_seats:'',
            //myseats:this.props.navigation.state.params.myseats,
            station:[],selected2:'',
            array:[],co:true,data:[],
           // t_id:this.props.navigation.state.params.t_id,
//selected: this.props.navigation.state.params.train,
            t_id: this.props.navigation.state.params.train,

            date:this.props.navigation.state.params.date,
        };
       this.mounted = true ;
       
        this.ref = firebase.firestore().collection('route');
        this.refer =firebase.firestore().collection('trainroutes');
        this.refrs =firebase.firestore().collection('trains');
        
    }
    componentWillUnmount(){
        this.ref=null;
        this.mounted =false ;
        this.refrs =null;
        this.refer = null;
    }

    componentDidMount(){

this.refrs.doc(this.state.t_id).onSnapshot(doc=>{
  
    this.setState({train_seats:doc.data().Seats,
        trainroute_id:doc.data().trainroute_id
    });
    console.log(doc.data());
    console.log(this.state.trainroute_id);
    this.GetData();
})






        // if (this.mounted){
        // this.ref.where('train_id','==',this.state.t_id).onSnapshot(query=>{
        //     // console.log(query.data());
        //     query.forEach(doc=>{
            
        //       this.setState({trainroute_id:doc.data().trainroute_id});
               
        //       this.GetData();
        //     });
        //    });
        // }
    }

    GetData() {
        if (this.mounted){
        this.refer.doc(this.state.trainroute_id).onSnapshot(query=>{
           
              this.setState({station:query.data().stations});
    
              this.Data();
          });
        }
      }


      Data() {
          if (this.mounted) {
        var name = [];
    
        for (const i = 0; i < this.state.station.length; i++) {
          var documentReference = firebase.firestore().collection('cities').doc(this.state.station[i]);
          documentReference.get().then(documentSnapshot => {
            // check and do something with the data here.
            name.push({
              name: documentSnapshot.data().station_name,
              lat: documentSnapshot.data().lat,
              lng: documentSnapshot.data().lng,
              id :documentSnapshot.id,
              status : false
            });
            

            this.setState({ stationData: name });
           
           // this.add();
          });
         
        }
    }


    }
    fare=()=>{
        const { navigate } = this.props.navigation;
       
        if(this.state.selected1 === "" && this.state.selected2 == ""){
            ToastAndroid.show("Please Select Source And Destination",ToastAndroid.SHORT);
        }
        if(this.state.selected1 !== "" && this.state.selected2 === ""){
             ToastAndroid.show("Please Select Source And Destination",ToastAndroid.SHORT);
           
         }
         if(this.state.selected1 === "" && this.state.selected2 !== ""){
             ToastAndroid.show("Please Select Source And Destination",ToastAndroid.SHORT);
            
         }
       
         if(this.state.selected1 !== "" && this.state.selected2 !== "") {
          
            if(this.state.selected1 === this.state.selected2 || this.state.selected2 === this.state.selected1) {
                ToastAndroid.show("Source And Destination Cannot Be Same",ToastAndroid.SHORT);
            
            }
            else {

            const a =this.state.selected1.split(',');
            const b =this.state.selected2.split(',');
                console.log(a[2]);
                console.log(b[2]);
            const lat1=a[0];
            const lng1=a[1];
            const lat2=b[0];
            const lng2=b[0]
            const source  = a[2];
            const destination =b[2];    
           const dist = geolib.getDistance(
            {latitude:a[0], longitude: a[1]},
            {latitude:b[0], longitude: b[1]}
            );
           

            const dis =geolib.convertUnit('km',dist);
            const fare = parseInt(dis*0.03);
            this.setState({fare:fare});
           
       
            navigate('Seats',{train:this.state.t_id,t_s:this.state.train_seats,date:this.state.date,fare:fare,slat:lat1,slng:lng1,dlat:lat2,dlng:lng2
            ,t_r_id:this.state.trainroute_id ,source:source,destination:destination});

           }

        }
       
    }



    
    render() {
     
        

const {uid} =firebase.auth().currentUser;
const { navigate } = this.props.navigation;
const { params } = this.props.navigation;
return (
    <View style={styles.container}>
    
   
                        

                        <Card title="Select source and destination" containerStyle={{height:'50%',backgroundColor:'#eeeeee'}}
                          dividerStyle={{backgroundColor:'black',marginBottom:30}}
                            titleStyle={{fontSize:18}}
                        >
                           
                       
                        <View style={styles.list}>                    
                            <Text  style={{ fontSize: 15, color: 'red', marginBottom: 5, textAlign: 'center' }}>Source</Text>
                            <Picker                              
                                mode="dropdown"
                                placeholder='Select'                               
                                style={{   width: 10,height:20,marginLeft:135 }}
                                itemStyle={{alignItems:'center',alignContent:'center',alignItems:'center'}}
                                itemTextStyle={{alignItems:'center',alignContent:'center',alignItems:'center'}}
                                selectedValue={this.state.selected1}
                                onValueChange={i => {this.setState({selected1:i})}}
                            >
                              <Picker.Item label="Select" value="" />
                            {
                                this.state.stationData.map((i,index)=>{
                                return  <Picker.Item key={index} label= {`${i.name}`} value={`${i.lat},${i.lng},${i.name}`} />
                                })
                            }
                                     

                            </Picker>
                            </View>




                             

                              <View style={styles.list}>
                            <Text  style={{ fontSize: 15, color: 'red', marginBottom: 5, textAlign: 'center' }}>Destination</Text>
                            <Picker                              
                                mode="dropdown"
                                placeholder='Select'                               
                                style={{   width: 10,height:20,marginLeft:106 }}
                                selectedValue={this.state.selected2}
                                onValueChange={i => {this.setState({selected2:i})}}
                            >
                              <Picker.Item label="Select" value="" 
                                  
                              />
                            {
                                this.state.stationData.map((i,index)=>{
                                return  <Picker.Item key={index} label= {`${i.name}`} value={`${i.lat},${i.lng},${i.name}`} />
                                })
                            }
                                     

                            </Picker>
                            </View>
                            <Button
                                icon={{
                                    name: 'airline-seat-recline-extra',
                                    size: 15,
                                    color: 'white'
                                }}
                                title='Check Availability'
                                buttonStyle={styles.btnstyle}

                                onPress={this.fare}
                            />


                            </Card>


                    
    </View>
);
}

}    



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',


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
        backgroundColor:'#eeeeee',
        marginBottom:10

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