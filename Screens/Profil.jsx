import React, { useEffect, useRef, useState } from 'react';
import {

    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import axios from "axios";
import {ENDPOINT_API} from "../endpoint-backend";
import AsyncStorage from '@react-native-async-storage/async-storage';


function formatDate(dateString) {
    const date = new Date(dateString); // Convert to Date object
  
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad if necessary
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (1-based)
    const year = date.getUTCFullYear(); // Get year
  
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  }

export default function Profil({route}) {


    const {setIsAuthenticated} = route.params;

    const [isAtleastOneModified, setisAtleastOneModified] = useState(false);
    const [isAtleastOneModified2,setisAtleastOneModified2] = useState(false);

    const navigation = useNavigation();
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const [fullName, setfullName] = useState(null);
    const [email, setemail] = useState(null);
    const [mobile, setmobile] = useState(null);
    const [createdAt, setcreatedAt] = useState(null);
    const [companyName, setcompanyName] = useState(null);
    const [job , setJob] = useState(null);


    const [userType, setUserType] = useState(null);  
    const [isLoading, setIsLoading] = useState(true); // Skeleton loading state
    const [isModifyClicked, setisModifyClicked] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

           


    useEffect(() => {
        const fetchData = async () => {
            try {
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

                const token = await AsyncStorage.getItem('authToken');
                console.log("token  =====>",token);
    
                const resp = await axios.get(`${ENDPOINT_API}profile`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                console.log("resp Profile ===>" ,resp);
                if(resp.status === 200){
                    console.log("Serre ===>",resp.data);
                    setfullName(resp.data.user.name);
                    setemail(resp.data.user.email);
                    setmobile(resp.data.user.telephone);
                    setcompanyName(resp.data.user.entreprise);
                    setUserType(resp.data.user.userType);
                    setJob(resp.data.user.job);


                    await new Promise(resolve => setTimeout(resolve, 111));
                }
            }catch(e){
                  console.log("error Serre SingleSerre===>",e);
                  await new Promise(resolve => setTimeout(resolve, 111));
            } finally {
                const timer = setTimeout(() => {
                    setIsLoading(false);
                }, 111);
        
                return () => clearTimeout(timer);  
            }
        };
        fetchData();
    }, []);

    const handleSaveData = async()=>{

        const token = await AsyncStorage.getItem('authToken');
            try{
              let data = {
                name : fullName, 
                email : email , 
                entreprise: companyName,
                job:job,
                telephone:mobile
              }
              
              const resp = await axios.put(`${ENDPOINT_API}profile/update`, data, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if(resp.status === 200){
                console.log("resp =====>",resp);
                setisAtleastOneModified(false);
                setisAtleastOneModified2(false);
                setisModifyClicked(false);
              }
            }
            catch(e){
              console.log(e.message);
     
            } finally{
            }
       }


    const [fontsLoaded] = useFonts({
        'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
        'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
        'InriaLight': require('../fonts/InriaSerif-Light.ttf'),
        'InriaBold': require('../fonts/InriaSerif-Bold.ttf'),
        'InterBold': require('../fonts/Inter_28pt-SemiBold.ttf'),
    });
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

                    <ScrollView style={styles.container}>

                        <View style={styles.header}>
                            
                        {
                                !isLoading ? 
                                <>
                                {
                                    !isModifyClicked ?  
                                    <TouchableOpacity 
                                        style={styles.addButton}
                                        onPress={()=>{
                                            setisModifyClicked(true);
                                        }}  
                                    >
                                        <Feather name="edit-2" size={16} color="#fff" />
                                    </TouchableOpacity> 
                                    :
                                    <View
                                        style={{
                                            position : "relative"
                                        }}
                                    >
                                        <TouchableOpacity 
                                            style={styles.addButton222}
                                            onPress={handleSaveData}  
                                        >
                                            <Feather name="check" size={17} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 20,
                                                backgroundColor: '#BE2929',
                                                borderWidth : 1,
                                                borderColor : "#BE2929",
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position : "absolute", left : 42
                                            }}
                                            onPress={()=>{
                                                setisAtleastOneModified(false);
                                                setisAtleastOneModified2(false);
                                                setisModifyClicked(false);
                                            }}  
                                        >
                                            <Feather name="x" size={19} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                }
                                </>
                                :
                                <TouchableOpacity style={styles.addButton2} />
                            }


                            <Text style={styles.title}>
                                Mon Profil
                            </Text>

                            <TouchableOpacity
                                style={styles.elipsisButton}
                                onPress={() => setIsPopupVisible(!isPopupVisible)}
                            >
                                <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                            </TouchableOpacity>
                        </View>



                    {
                        isLoading ? 
                        <>
                            <View style={styles.skeletonImageContainer}>
                                <Animated.View
                                    style={[
                                        styles.skeletonProfileImage,
                                        {
                                            opacity: animation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.3, 1],          
                                            }),
                                        },
                                    ]}
                                />
                            </View>  
                            <View  style={styles.HRHR2}  />
                            <View style={styles.skeletonInfoContainer}>
                                
                                {[
                                    { labelWidth: '30%', valueWidth: '25%' },
                                    { labelWidth: '26%', valueWidth: '40%' },
                                    { labelWidth: '40%', valueWidth: '30%' },
                                    { labelWidth: '20%', valueWidth: '10%' },
                                    { labelWidth: '27%', valueWidth: '22%' },
                                ].map((item, index) => (
                                    <View key={index} style={styles.skeletonInfoRow}>
                                        <Animated.View
                                            style={[
                                                styles.skeletonLabel,
                                                {
                                                    opacity: animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0.3, 1],
                                                    }),
                                                    width: item.labelWidth, 
                                                },
                                            ]}
                                        />
                                        <Animated.View
                                            style={[
                                                styles.skeletonValue,
                                                {
                                                    opacity: animation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0.3, 1],
                                                    }),
                                                    width: item.valueWidth, 
                                                },
                                            ]}
                                        />
                                    </View>
                                ))}
                            </View>


 
                        </>
                        :  
                        <>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={require('../images/avatar.jpg')}
                                    style={styles.profileImage}
                                />
                            </View>

                            <View  style={styles.HRHR2}  />
                                    

                            <View style={styles.infoContainer}>
                                <Text style={styles.sectionTitle}>Informations personnelles{isAtleastOneModified &&<Text style={styles.titleX} >&nbsp;&nbsp;(Édité)</Text>}</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>&nbsp;Nom et prénom :</Text>
                                    {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{fullName}&nbsp;&nbsp;</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez votre nom complet..."
                                            value={fullName}
                                            onChangeText={(text) => {
                                                setfullName(text);  
                                                setisAtleastOneModified(true); 
                                            }}
                                        />
                                    }
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>&nbsp;Email :</Text>
                                    {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{email}&nbsp;&nbsp;</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez votre adresse email..."
                                            value={email}
                                            onChangeText={(text) => {
                                                setemail(text);  
                                                setisAtleastOneModified(true); 
                                            }}
                                        />
                                    }
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>&nbsp;N° téléphone :</Text>
                                    {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{mobile}&nbsp;&nbsp;</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez votre n° téléphone..."
                                            value={mobile}
                                            onChangeText={(text) => {
                                                setmobile(text);  
                                                setisAtleastOneModified(true); 
                                            }}
                                        />
                                    }
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>&nbsp;Membre depuis le :</Text>
                                    <Text style={styles.value}>{formatDate(createdAt)}&nbsp;&nbsp;</Text>
                                </View>
                            </View>

                            {
                                userType === "admin" || userType === "super_admin" ? (
                                <>
                                    <View  style={styles.HRHR}  />
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.sectionTitle}>Entreprise agricole{isAtleastOneModified2 &&<Text style={styles.titleX} >&nbsp;&nbsp;(Édité)</Text>}</Text>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>&nbsp;Appelation :</Text>
                                            {
                                                !isModifyClicked ? 
                                                <Text style={styles.value}>{companyName}&nbsp;&nbsp;</Text>
                                                :
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Entrez le nom de l'entreprise..."
                                                    value={companyName}
                                                    onChangeText={(text) => {
                                                        setcompanyName(text);  
                                                        setisAtleastOneModified2(true); 
                                                    }}
                                                />
                                            }
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>&nbsp;Post :</Text>
                                            {
                                                !isModifyClicked ? 
                                                <Text style={styles.value}>{job}&nbsp;&nbsp;</Text>
                                                :
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Entrez le nom de l'entreprise..."
                                                    value={job}
                                                    onChangeText={(text) => {
                                                        setJob(text);  
                                                        setisAtleastOneModified2(true); 
                                                    }}
                                                />
                                            }
                                        </View>
                                    </View>
                                </>
                                ):null
                            }

                        </>
                    }
                        
                    </ScrollView>

                   
             
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
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
    imageContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 106,
        height: 106,
        borderRadius: 200,
    },
    infoContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'InterBold',
        fontSize: 17,
        fontWeight : "600",
        color: '#141414',
        marginBottom: 20,
    },
    HRHR : {
        width : '100%', 
        height : 1, 
        backgroundColor : "#E6E6E6", 
        marginBottom : 20,
    },
    HRHR2 : {
        width : '100%', 
        height : 1, 
        backgroundColor : "white", 
        marginBottom : 30,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems : "center"
    },
    infoRowCust: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems : "center",
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    value: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        position : "absolute", 
        bottom : 20, 
        right : 20, 
        left : 20
    },
    deleteButton: {
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
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#BE2929',
        textAlign : "center",
    },
    editButton: {
        backgroundColor: '#BE2929',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        width : "66%",
        height : 52,
        alignItems : "center", 
        justifyContent : "center"
    },
    editButtonCustomize : {
        width : "100%",
    },
    editButton2 :{
        backgroundColor: '#BE2929',
        height : 52,
        borderRadius: 8,
        width : "68%", alignItems : "center", justifyContent : "center"

    },
    editButton22 :{
        backgroundColor: '#FDECEC',
        height : 52,
        borderRadius: 8,borderColor : "#C96666",borderWidth : 1,
        width : "29%", alignItems : "center", justifyContent : "center"

    },
    editButtonText: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#fff',
        textAlign : "center"
    },

    editButtonText22: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#BE2929',
        textAlign : "center"
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#BE2929',
        alignItems: 'center',
        justifyContent: 'center',
      },
      addButton2 : {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },

      skeletonHeaderButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },   
    skeletonTitle: {
        height: 22,
        width: 100,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    skeletonImageContainer: {
        alignItems: 'center',
        marginBottom : 34  
    },
    skeletonProfileImage: {
        width: 106,
        height: 106,
        borderRadius: 53,
        backgroundColor: '#e0e0e0',  
    },
    skeletonInfoContainer: { 
        marginBottom: 20,
    },
    skeletonInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18   ,
    },
    skeletonLabel: {
        width: '35%',
        height: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    
    skeletonValue: {
        width: '50%',
        height: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    skeletonDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 20,
    },
    skeletonEditButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginTop: 20,
    },
    addButton222: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#BE2929',
        alignItems: 'center',
        justifyContent: 'center',
      },
      titleX : {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#BE2929',
        fontStyle : "italic"
    },
    input : { width : 150, padding : 0,height : 30, borderRadius : 0, borderColor : "gray", borderWidth : 1,paddingLeft : 10, paddingRight : 10, fontFamily : "Inter", fontSize : 14  },
});