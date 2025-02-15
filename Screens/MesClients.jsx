import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Image,
    Animated,
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import axios from "axios";
import {ENDPOINT_API} from "../endpoint-backend";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MesClients({ route }) {


    const {setIsAuthenticated} = route.params;

    
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;
    const [admins , setAdmins] = useState([]);
    const [countNewUser , setCountNewUser ] = useState(0);
    const [userCurrentId, setuserCurrentId] = useState(null);
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

                const ID = await AsyncStorage.getItem('UserId')
    
    
                if(ID){
                    setuserCurrentId(ID);
                }
                else{
                    setuserCurrentId("666");
                }
    
    
                try {
                    setIsLoading(true);
                    startWavyAnimation();
                    const token = await AsyncStorage.getItem('authToken');
                    console.log("token  =====>",token);
        
                    const resp = await axios.get(`${ENDPOINT_API}admins`, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    console.log("resp custmore ===>" ,resp);
                    if(resp.status === 200){
                        console.log("All custmore ===>",resp.data);
                        setAdmins(resp.data.admins);
                        setCountNewUser(resp.data.newUser);
                    }
                    await new Promise(resolve => setTimeout(resolve, 111));
                }catch(e){
                      console.log("error custmore ===>",e);
                      setAdmins([]);
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
        {
            item.id.toString() !== userCurrentId && 
            <TouchableOpacity
            onPress={() => {
                if (item.role !== "staff") {
                    navigation.navigate('ProfilOthers', {
                        id: item.id,
                        type: item.job,
                        tailleEquipe: item.tailleEquipe,
                        fullName: item.name,
                        image: item.image,
                        email: item.email,
                        mobile: item.telephone,
                        entrepriseName: item.entreprise,
                        job:item.job,
                        createdAt: item.created_at
                    });
                } else {
                    navigation.navigate('ProfilOthers', {
                        id: item.id,
                        type: item.job,
                        fullName: item.name,
                        image: item.image,
                        email: item.email,
                        mobile: item.mobile,
                        job:item.job,
                        createdAt: new Date(item.created_at).toDateString() !==
                        new Date().toDateString()
                        ? new Date(item.created_at).toLocaleDateString()
                        : new Date(item.created_at)
                        .toLocaleTimeString([], { hour12: false })
                        .slice(0, -3),
                    });
                }
            }}
            style={styles.card}
            key={item.id}
        >
            <View style={styles.imageContainer}>
                {/* <Image style={styles.imageInsider} source={{ uri: item.image }} /> */}
                <Image
                    source={require('../images/avatar.jpg')}
                    style={styles.imageInsider}
                />
            </View>
            <View style={styles.infosContainer}>
                <Text style={styles.textInfos1}>{item.name} </Text>
                {/* <Text style={styles.textInfos2}></Text> */}
                <Text style={styles.textInfos2}>{item.email}</Text>
                <Text style={styles.textInfos2}>{item.telephone}</Text>
            </View>
            <View style={styles.carretRight}>
                <Ionicons name="chevron-forward" size={20} color="gray" />
            </View>
        </TouchableOpacity>
        }
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
                    {
                        !isLoading ? 
                                   <TouchableOpacity 
                                                       style={styles.returnButton}
                                                       onPress={() => {
                                                           navigation.goBack();
                                                       }}
                                                   >
                                                       <Ionicons name="chevron-back" size={24} color="#141414" />
                                                   </TouchableOpacity>

                            :
                        <TouchableOpacity style={styles.addButton2} />
                    }
                    <Text style={styles.title}>Mes Clients</Text>
                    <TouchableOpacity
                        onPress={() => setIsPopupVisible(!isPopupVisible)}
                        style={styles.elipsisButton}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                    </TouchableOpacity>
                </View>

                {
                    !isLoading && 
                    <View
                        style={styles.husrfousfhuow}
                    >
                        <TouchableOpacity 
                            style={styles.zishdwfisudhw}
                            onPress={() =>{
                            navigation.navigate('NouvellesDemandes');
                            }}
                        >
                            <Image
                            style={styles.picturensiufwhduohswdoff}
                            source={
                                require('../images/sparkle.png')
                            }
                            />
                            <Text
                            style={styles.zishdwfisudhwText}
                            >
                            {countNewUser}&nbsp;&nbsp;Nouvelles Demandes
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

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
                      data={admins}
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
        paddingTop: 30,
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,

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
        paddingTop: 20,
    },
    card: {
        borderRadius: 0,
        textAlign: 'center',
        height: 'auto',
        flexDirection: 'row',
        marginBottom: 34,
        shadowColor: 'gray',
    },
    infosContainer: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'flex-start',
    },
    textInfos1: {
        width: '100%',
        textAlign: 'left',
        fontFamily: 'InterBold',
        fontSize: 17,
        fontWeight : '700',
        color : "black"
    },
    textInfos2: {
        width: '100%',
        textAlign: 'left',
        fontFamily: 'InterBold',
        fontSize: 15,
        color: 'gray',
    },
    imageContainer: {
        height: 69,
        width: 69,
        marginRight: 13,
    },
    imageInsider: {
        height: 69,
        width: 69,
        borderRadius: 100,
        objectFit: 'cover',
    },
    carretRight: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
    },
    elipsisButton: {
        width: 40,
        height: 40,
        padding: 0,
        alignItems: 'flex-end',
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
    height: 66,
    width: 66,
    borderRadius: 33,
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
    zishdwfisudhw : {
      width : "100%",
      height : 50,
      borderRadius : 9,
      backgroundColor : "#BE2929", 
      alignItems : "center",
      justifyContent : "center", 
      flexDirection : "row", 
      marginBottom : 20
    },    
    zishdwfisudhwText : {
      fontFamily: 'InterBold',
      fontSize: 16,
      color : "white",   
      textAlign : "center"
    },    
    husrfousfhuow : {
      width : "100%",
      paddingRight : 20, 
      paddingLeft : 20
    },
    picturensiufwhduohswdoff : {
      height : 20, 
      width : 20, 
      objectFit : "cover", 
      marginRight : 7
    }
    ,addButton2 : {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
});