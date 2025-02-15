import React, { useState, useEffect, useRef } from 'react';
import PopUpNavigate from "../Components/PopUpNavigate";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import axios from "axios";
import {ENDPOINT_API} from "../endpoint-backend";
import AsyncStorage from '@react-native-async-storage/async-storage';





export default function SingleDemande({route}) {


    const {setIsAuthenticated} = route.params;


    const navigation = useNavigation();
    const { id , name ,email , entreprise ,telephone , created_at } = route.params; 
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const skeletonAnimation = useRef(new Animated.Value(0)).current;

 const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
        }); 


    useEffect(() => {
        setIsLoading(true);
        Animated.loop(
            Animated.sequence([
                Animated.timing(skeletonAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(skeletonAnimation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        setIsLoading(false);

    }, []);


    const skeletonBackground = skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#f5f5f5'],
    });



 const handleActive = async()=>{

    setIsLoading2(true);

    const token = await AsyncStorage.getItem('authToken');
     
        try{

            let data = {
                status: true,
              }
          
          const resp = await axios.put(`${ENDPOINT_API}users/${id}/status`, data, {
            headers: {
              'Authorization': `Bearer ${token}`     
            }
          });
            if(resp.status === 200){
                setIsLoading2(false);
                console.log("resp =====>",resp);
                navigation.navigate("NouvellesDemandes");
            } 
            else{
                setIsLoading2(false);
                Alert.alert("Une erreur est survenue lors de l'approuvation.");
            }
        }
        catch(e){
          console.log(e.message);
          setIsLoading2(false);
          Alert.alert("Une erreur est survenue lors de l'approuvation.");
        } finally{
            setIsLoading2(false)
        }
   }
  
      

    



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
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#141414" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Détails Demande</Text>
                    <TouchableOpacity 
                        onPress={() => setIsPopupVisible(!isPopupVisible)}
                        style={styles.elipsisButton}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {isLoading ? (
                    <>
                        <View style={styles.skeletonContainer}>
                            {[...Array(4)].map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.skeletonRow,  
                                        { 
                                            backgroundColor: skeletonBackground,  
                                            width: index === 0 ? '30%' 
                                            : index === 1 ? '60%' 
                                            : index === 2 ? '40%'
                                            : index === 3 ? '70%'
                                            :  '37%'
                                            
                                        },
                                    ]}
                                />
                            ))}
                        </View>


                        {/* Skeleton for Buttons */}
                        <View style={styles.skeletonButtonContainer}>
                            <Animated.View
                                style={[
                                    styles.skeletonButton,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                            <Animated.View
                                style={[
                                    styles.skeletonButton,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                        </View>
                    </>
                ) : (
                    <>

                        <View style={styles.detailsContainer}>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Entreprise :</Text>
                                <Text style={styles.value}>{entreprise}</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Nom et prénom :</Text>
                                <Text style={styles.value}>{name}</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Email :</Text>
                                <Text style={styles.value}>{email}</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>N° Téléphone :</Text>
                                <Text style={styles.value}>{telephone === "123-456-7890" ? "---" : telephone}</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Date de soumission :</Text>
                                <Text style={styles.value}>{created_at}</Text>
                            </View>
                        </View>

                        <View
                            style={styles.buttonContainerX}
                        >
                            {/* <TouchableOpacity style={styles.deleteButton} >
                                <Text style={styles.deleteButtonText} >
                                    Rejeter
                                </Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.editButton} disabled={isLoading2}  onPress={handleActive}>
                                <Text style={styles.editButtonText} >
                                {
                                    isLoading2 ? "Traitement en cours..." : "Approuver la demande"
                                }
                                </Text>
                            </TouchableOpacity>
                        </View>
 
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
        paddingTop: 30,
        paddingBottom: 0,
        paddingHorizontal: 20,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingBottom : 0

    },
    returnButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "flex-start",
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'InriaBold',
        fontSize: 22,
        color: '#141414',
    },
    elipsisButton: {
        width: 40,
        height: 40,
        padding: 0,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    skeletonContainer: {
        marginTop: 20,
    },
    skeletonRow: {
        height: 20,
        borderRadius: 8,
        marginBottom: 15,
    },
    
    skeletonButtonContainer: {
        marginTop: 20,
    },
    skeletonButton: {
        height: 50,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%',
    },
    detailsContainer: {
        marginBottom: 20,
        marginTop: 30,
    },
    ViewLabel: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    TitleLabel: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#141414',
    },
    value: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
        textAlign: "right",
    },
    valueHighlight: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#BE2929',
        textAlign: "right",
    },
    buttonContainer: {
        marginTop: 20,
    },
    videoButton: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        paddingVertical: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    videoButtonText: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    deleteButton: {
        backgroundColor: '#FDECEC',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
    },
    deleteButtonText: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#BE2929',
    },
    imageContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 106,
        height: 106,
        borderRadius: 15,
    },
    HRHR2 : {
        width : '100%', 
        height : 1, 
        backgroundColor : "white", 
        marginBottom : 20,
    },
    HRHR : {
        width : '100%', 
        height : 1, 
        backgroundColor : "#E6E6E6", 
        marginBottom : 20,
    },
    addSerre : {
        height : 30, 
        width : 30, 
        backgroundColor : "#BE2929",
        borderRadius : 100,
        alignItems : "center", 
        justifyContent : "center"
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop : 20,
    },
    infosContainer : {
        width : "auto", 
        height : "auto",
        textAlign : "left",
        justifyContent : "center" 
    },
    buttonContainerX : {
        position : 'absolute',
        bottom : 20, 
        right : 20, 
        left : 20,
        flexDirection : "row", 
        justifyContent : "space-between"
    },
    deleteButton : {
        backgroundColor: '#FDECEC',
        borderRadius: 8,
        width : "30%",
        height : 52,
        alignItems : "center", 
        justifyContent : "center",
        borderColor : "#FFACAC",
        borderWidth : 1
    },
    deleteButtonText: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#BE2929',
        textAlign : "center",
    },
    editButton: {
        backgroundColor: '#BE2929',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        width : "100%",
        height : 52,
        alignItems : "center", 
        justifyContent : "center"
    },
    editButtonCustomize : {
        width : "100%",
    },
    editButtonText: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#fff',
        textAlign : "center"
    },
});
