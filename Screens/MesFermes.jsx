import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import axios from "axios";
import {ENDPOINT_API} from "../endpoint-backend";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MesFermes({ route }) {

  const {setIsAuthenticated} = route.params;


    const animation = useRef(new Animated.Value(0)).current;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allFermes , setAllFermes] = useState([]);

  const [fontsLoaded] = useFonts({
           'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
           "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
           "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
           "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
           "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
         }); 
    const navigation = useNavigation();





    const renderItem = ({ item }) => (
      <TouchableOpacity 
        onPress={()=>{
          navigation.navigate('SingleFarm', {id : item.id});
        }}
        style={styles.card}
        key={item.id}
      >
        <View style={styles.infosContainer}>
          <Text style={styles.textInfos1}>{item.nom_ferme}</Text>
          <Text style={styles.textInfos2}>{item.commune}</Text> 
          <Text style={styles.textInfos3}>{item.surface} Hectares</Text>
        </View>
        <View style={styles.carretRight}>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </View>
      </TouchableOpacity>
    );
  



    

    useFocusEffect(
      useCallback(() => {
          const fetchData = async () => {
              try {
                  setIsLoading(true);
                  startWavyAnimation();
                  const token = await AsyncStorage.getItem('authToken');
  
                  const resp = await axios.get(`${ENDPOINT_API}fermes`, {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  });
  
                  if (resp.status === 200) {
                      const sortedFarms = resp.data.fermes.sort((a, b) => 
                          new Date(b.created_at) - new Date(a.created_at)
                      );

                      setAllFermes(sortedFarms);
                  }
                  await new Promise(resolve => setTimeout(resolve, 1000));
              } catch (e) {
                  console.log("error Ferme ===>", e);
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
          
          {
              !isLoading ? 
              <TouchableOpacity 
                style={styles.addButton}
                onPress={()=>{
                  navigation.navigate('AjouterFerme')
                }}  
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity> 
                :
              <TouchableOpacity style={styles.addButton2} />
          }

          <Text style={styles.title}>Mes Fermes</Text>
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
                                  styles.skeletonCard,
                                  {
                                      opacity: animation.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [1, 0.4],
                                      }),
                                  },
                              ]}
                          >
                              <View style={styles.imageSkeletonContainer}>
                                  <View style={styles.skeletonCircle} />
                              </View>
                              <View style={styles.textSkeletonContainer}>
                                   <View style={styles.skeletonLine} />
                                  <View style={styles.skeletonLineShort} />
                                  <View style={styles.skeletonLineMedium} />
                                  <View style={styles.skeletonLineVeryShort} />
                              </View>
                          </Animated.View>
                      ))}
                  </View>
              ) : (
                  <FlatList
                    data={allFermes}
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
      paddingBottom : 0

    },
    addButton: {
      width: 30,
      height: 30,
      borderRadius: 20,
      backgroundColor: '#BE2929',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: 'InriaBold',
      fontSize: 22,
      color: '#141414',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop : 20,
    },
    card: {
      borderRadius: 0,
      textAlign : "center",
      height : "auto",
      flexDirection :"row",
      marginBottom: 20,
      shadowColor: 'gray',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 13,
      elevation: 8,
      backgroundColor : "white", 
      padding : 10,
      paddingRight: 16, 
      paddingLeft : 16, 
      borderRadius:10
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
      height : 77,
      width : 77, 
      marginRight : 13, 
    },
    imageInsider : {
      height : 77,
      width : 77, 
      borderRadius : 15,
      objectFit :"cover",
    },


    carretRight : {
      height : "100%", 
      justifyContent : "center", 
      alignItems : "center", 
      position : "absolute", 
      right : 10, 
      top : 10
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
      paddingHorizontal: 20,
      paddingTop: 20,
  },
  skeletonCard: {
  backgroundColor: '#f0f0f0',
  borderRadius: 12,
  marginBottom: 16,
  height: 100,
  flexDirection: 'row',
  padding: 10,
},
imageSkeletonContainer: {
  width: 80,
  alignItems: 'center',
  justifyContent: 'center',
},
skeletonCircle: {
  height: 77,    
  width: 77,
  borderRadius: 10,
  backgroundColor: '#e0e0e0',
},
textSkeletonContainer: {
  flex: 1,
  justifyContent: 'center',
  paddingLeft: 10,
},
  skeletonLine: {
    marginTop : 10,
    height: 13,
    width : "80%",
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '50%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineMedium: {
    width: '70%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8, 
  },
  skeletonLineVeryShort : {
    width: '30%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8, 
  },

  addButton2 : {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});



