import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated,
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import axios from "axios";
import {ENDPOINT_API} from "../endpoint-backend";
import AsyncStorage from '@react-native-async-storage/async-storage';




function formatDate(dateString) {
  const date = new Date(dateString); // Convert to Date object

  const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad if necessary
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (1-based)
  const year = date.getUTCFullYear(); // Get year

  const hours = String(date.getUTCHours()).padStart(2, '0'); // Get hours and pad if necessary
  const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Get minutes and pad if necessary

  return `${hours}:${minutes}  ${day}/${month}/${year}`; // Return in DD/MM/YYYY hh:mm format
}




export default function NouvellesDemandes({ route }) {

  const {setIsAuthenticated} = route.params;

  
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const animation = useRef(new Animated.Value(0)).current;
    const [newUsers , setNewUsers] = useState([]);
 const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
        }); 

    const navigation = useNavigation();

    

 

  useFocusEffect(
    useCallback(() => {
       
    const fetchData = async () => {
      try {
          setIsLoading(true);
          startWavyAnimation();
          const token = await AsyncStorage.getItem('authToken');
          console.log("token  =====>",token);

          const resp = await axios.get(`${ENDPOINT_API}new-users`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log("resp custmore ===>" ,resp);
          if(resp.status === 200){
              console.log("All custmore ===>",resp.data);
              setNewUsers(resp.data.admins);

          }
          await new Promise(resolve => setTimeout(resolve, 222));
      }catch(e){
            console.log("error custmore ===>",e);
            setNewUsers([]);

      } finally {
          setIsLoading(false);
      }
  };
  fetchData();


        return () => {};  
    }, [])
);

  
    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 399,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 399,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const renderItem = ({ item }) => (
      <>
        <TouchableOpacity 
          onPress={()=>{
            navigation.navigate('SingleDemande', {
              id : item.id ,
              name : item.name ,
              email : item.email,
              entreprise : item.entreprise,
              telephone : item.telephone,
              created_at : formatDate(item.created_at) 
            });
          }}
          style={styles.card3s}
          key={item.id}
        >  
          <View style={styles.infosContainer}>
            <Text style={styles.textInfos1}>&nbsp;&nbsp;&nbsp;&nbsp;{item.name}  </Text>
            <Text style={styles.textInfos2}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.email}</Text>
            <Text style={styles.textInfos3}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {
                formatDate(item.created_at)
              }
            </Text>
          </View>
          <View style={styles.carretRight}>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </View>
        </TouchableOpacity>
        <View style={styles.jackSp} />
      </>
    );

    if (!fontsLoaded) {
        return null;
    }

    return (
      <>
        <PopUpNavigate   
            setIsAuthenticated={setIsAuthenticated}
            isPopupVisible={isPopupVisible}
            setIsPopupVisible={setIsPopupVisible}  
        />

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.returnButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#141414" />
            </TouchableOpacity>
            <Text style={styles.title}>Nouvelles Demandes</Text>
            <TouchableOpacity 
              onPress={() => setIsPopupVisible(!isPopupVisible)}
              style={styles.elipsisButton}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.skeletonContainer}>
              {[...Array(3)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.skeletonRow,
                    {
                      opacity: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.4],
                      }),
                    },
                  ]}
                >
                  <View style={styles.skeletonColumnBig}>
                    <View style={styles.skeletonLineSmall} />
                    <View style={styles.skeletonLineMedium} />
                    <View style={styles.skeletonLineBig2} />
                    <View style={styles.skeletonLineBig} />
                  </View>
                  <View style={styles.skeletonColumnSmall}>  
                    <View style={styles.skeletonButton} />
                  </View>
                </Animated.View>
              ))}
            </View>
          ) : (
            <FlatList
              data={newUsers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </>
    );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop : 30,
      paddingBottom: 0 ,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 20,
 
    },
   
    title: {
      fontFamily: 'InriaBold',
      fontSize: 22,
      color: '#141414',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop : 0,
    },
    card: {
      borderRadius: 0,
      textAlign : "center",
      height : "auto",
      flexDirection :"row",
      paddingBottom : 17,
      paddingTop : 17,
      marginTop : 3,
      marginBottom : 3,
    },
    card3s: {
      borderRadius: 9,
      textAlign : "center",
      marginTop : 3,
      marginBottom : 3,
      height : "auto",
      flexDirection :"row",
      paddingBottom : 17,
      backgroundColor : "whitesmoke",
      paddingTop : 17,
    },
    jackSp : {
      height : 1, 
      backgroundColor: "#EAEAEA",
    },
    infosContainer : {
      width : "auto", 
      height : "auto",
      textAlign : "left",
      justifyContent : "center"
    },
    textInfos1 : {
      width : "100%", 
      textAlign : "left", 
      fontFamily : "InterBold",
      fontSize : 17
    },
    textInfos2 : {
      width : "100%", 
      textAlign : "left", 
      fontFamily : "Inter",
      fontSize : 15,
      color : "gray",
    },
    textInfos3 : {
      width : "100%", 
      textAlign : "left", 
      fontFamily : "Inter",
      fontSize : 15,      
      color : "gray",
    },
    imageContainer : {
      height : 69,
      width : 69, 
      marginRight : 13, 
    },
    imageInsider : {
      height : 69,
      width : 69, 
      borderRadius : 100,
      objectFit :"cover",
    },


    carretRight : {
      height : "100%", 
      justifyContent : "center", 
      alignItems : "center", 
      position : "absolute", 
      right : 7,
      top : 17
    },

    label: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: '#141414',
      fontWeight : "600",
      marginBottom: 4,
      flexDirection  :"row",
      justifyContent : "space-between"
    },
    value: {
      fontFamily: 'Inter',
      fontSize: 15,
      color: '#141414',
      textAlign : "right"
    },
    value0 : {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: '#141414',
      fontWeight : "600",
    },
    highlight: {
      color: '#BE2929',
      fontFamily: 'InterBold',
    },
    elipsisButton : {
      width: 40,
      height: 40,
      padding : 0,
      alignItems: "flex-end",
      justifyContent: 'center',
    },


    skeletonContainer: {
      height : 111,
      marginLeft : 20, 
      marginRight : 20, 
    },
    skeletonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      height : 111,
      padding: 10,
    },
    skeletonColumnBig: {
      width : "90%",
    },
    skeletonColumnSmall: {
      width : "10%",
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    skeletonLineBig: {
      height: 14,
      width: '40%',  
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
      marginBottom: 8,
      marginLeft : 18
        }    ,
    skeletonLineSmall: {
      height: 13,   
      width: '30%',
      backgroundColor: '#e0e0e0',
      borderRadius: 6,  
      marginBottom: 8,
      marginLeft : 10

    },
    skeletonButton: {
      height: 30,
      width: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 15,
    },
    skeletonLineMedium: {
      height: 14,
      width: '66%'  ,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
      marginBottom: 8,
      marginLeft : 19
    },
    

    skeletonLineBig2: {
      height: 14,
      width: '50%',  
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
      marginBottom: 8,
      marginLeft : 18
        } 
      
});



