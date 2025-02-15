import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated,
    Alert,
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import axios from "axios";
import { ENDPOINT_API } from '../endpoint-backend';
import AsyncStorage from '@react-native-async-storage/async-storage';



function formateDate(isoString) {
  const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}



export default function MesCalculs({ route }) {

    const {setIsAuthenticated} = route.params;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [DATA, setDATA] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  
    const animation = useRef(new Animated.Value(0)).current;  
      const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
        }); 
    const navigation = useNavigation();

    


        const fetchData = async () => {
            try {
                startWavyAnimation(); 
                const token = await AsyncStorage.getItem('authToken');
                console.warn(token)
                const resp = await axios.get(`${ENDPOINT_API}predictions`, {
                  headers:{
                    Authorization : `Bearer ${token}`
                  }
                });
                if(resp.status === 200){
                  const sortedData = resp.data.sort((a, b) => {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA;
                  });
                  setDATA(sortedData);
                }
                else{
                  setDATA([]);
                }
            }
            catch(e){
              Alert.alert('Oups, une erreur est survenue lors de la récupération de vos données.')              
              console.log(e.message);
            }   
            finally{
              setIsLoading(false);
            }
      }



    useFocusEffect(
          useCallback(() => {  

            fetchData();
            
            return () => {};  
        }, [])
    );
  






    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 390,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 390,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };




    const renderItem = ({ item }) => (
      <TouchableOpacity 
        onPress={() => {
          navigation.navigate('SingleCalcul', { 
            id: item.id,
            classeTotale : item.classeTotale,
            created_at : item.created_at,
            nom_ferme : item.ferme.nom_ferme,
            surface : item.ferme.surface,
            commune : item.ferme.commune,
            ferme_id : item.ferme_id,
            serre_id : item.serre_id,
            nom_serre : item.serre.name,
            stemsDetected : item.stemsDetected,
            traitement_videos_sum_classe1 : item.traitement_videos_sum_classe1,
            traitement_videos_sum_classe2 : item.traitement_videos_sum_classe2,
            traitement_videos_sum_classe3 : item.traitement_videos_sum_classe3,
            traitement_videos_sum_classe4 : item.traitement_videos_sum_classe4,
            traitement_videos_sum_classe5 : item.traitement_videos_sum_classe5,
            traitement_videos_sum_classe6 : item.traitement_videos_sum_classe6,
            traitement_videos_sum_classe7 : item.traitement_videos_sum_classe7
          });
        }}
        style={styles.card}
        key={item.id}
      >
        <View style={styles.label}>
          <Text style={styles.value0}>Ferme : </Text>
          <Text style={styles.value}>{item.ferme ? item.ferme.nom_ferme : "---"}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Serre : </Text>
          <Text style={styles.value}>{item.serre? item.serre.name : "---"}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Tomates détectées :</Text>
          <Text style={[styles.value, styles.highlight]}>{item.classeTotale} tomates</Text>
        </View>
        <View style={styles.label}>
        <Text style={styles.value0}>Tiges détectées :</Text>
        <Text style={[styles.value, styles.highlight]}>{item.stemsDetected} tiges</Text>
      </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Date de création : </Text>
          <Text style={styles.value}>{formateDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
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
          {
              !isLoading ? 
              <TouchableOpacity 
                style={styles.addButton}
                onPress={()=>{
                  navigation.navigate('AjouterCalcul')
                }}  
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity> 
                :
              <TouchableOpacity style={styles.addButton2} />
          }
          <Text style={styles.title}>Mes Calculs</Text>
          <TouchableOpacity 
            onPress={() => setIsPopupVisible(!isPopupVisible)}
            style={styles.elipsisButton}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
          </TouchableOpacity>
        </View>

       



        {isLoading ? (
            <View style={styles.skeletonContainer}>
                {[...Array(2)].map((_, index) => (
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
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel1}></Text>
                            <View style={styles.skeletonLine} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel2}></Text>
                            <View style={styles.skeletonLine2} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel3}></Text>
                            <View style={styles.skeletonHighlight} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel4}></Text>
                            <View style={styles.skeletonHighlight2} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel5}></Text>
                            <View style={styles.skeletonLineShort} />
                        </View>
                    </Animated.View>
                ))}
            </View>
        ) : (
            <>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={isLoading}
                onRefresh={fetchData}
            />
            </>
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
      paddingBottom : 15
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
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: 'gray',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 13,
      elevation: 8,
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
      fontFamily: 'Inter',
      fontSize: 16,
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
    
  

    skeletonContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
  },
  skeletonCard: {
      backgroundColor: '#f0f0f0',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
  },
  skeletonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  
  skeletonLine: {
      width: '50%',
      height: 10,
      backgroundColor: '#e0e0e0',    
      borderRadius: 6,
  },
  skeletonLineShort: {
      width: '40%',
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
  },
  skeletonHighlight: {
      width: '12%',
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
  },

  skeletonHighlight2: {
    width: '20%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
},skeletonLine2: {
  width: '35%',
  height: 10,
  backgroundColor: '#e0e0e0',    
  borderRadius: 6,
},
  skeletonLabel1: {
    width: '17%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,        
},

skeletonLabel2: {
  width: '13%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
skeletonLabel3: {
  width: '44%',    
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
skeletonLabel4: {
  width: '34%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
skeletonLabel5: {
  width: '38%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
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