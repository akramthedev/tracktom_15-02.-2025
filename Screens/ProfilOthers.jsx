import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';



function formatDate(dateString) {
    const date = new Date(dateString); // Convert to Date object
  
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad if necessary
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (1-based)
    const year = date.getUTCFullYear(); // Get year
  
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  }



export default function ProfilOthers({route}) {
    const {setIsAuthenticated} = route.params;

    const navigation = useNavigation();
    const { id, type,tailleEquipe, fullName, email, mobile, entrepriseName, entrepriseEmail, entrepriseMobile, isGF, isGC, isVR,job, createdAt  } = route.params;
    const animation = useRef(new Animated.Value(0)).current;
    const [isModifyClicked, setisModifyClicked] = useState(false);
    const [isAtleastOneModified, setisAtleastOneModified] = useState(false);
    const [isAtleastOneModified2,setisAtleastOneModified2] = useState(false);


    const animatedValueFerme = useRef(new Animated.Value(isGererFerme ? 1 : 0)).current;
    const animatedValueCalculs = useRef(new Animated.Value(isGererCalculs ? 1 : 0)).current;
    const animatedValueRapport = useRef(new Animated.Value(isVoirRapport ? 1 : 0)).current;


    const [userId, setUserId] = useState(id && id);  
    const [userType, setUserType] = useState(type && (type === "admin" || type === "staff") ? type : "admin");
    const [userName, setuserName] = useState(fullName && fullName);     
    const [userEmail, setuserEmail] = useState(email && email);  
    const [userMobile, setuserMobile] = useState(mobile && mobile);  
    const [userCreatedAt, setuserCreatedAt] = useState("");     

    const [XEntrepriseName, setEntrepriseName] = useState(null);  
    const [XEntrepriseEmail, setEntrepriseEmail] = useState(null);  
    const [XEntrepriseMobile, setEntrepriseMobile] = useState(null);  
    const [XTaileEntreprise, setTailleEntreprise] = useState(tailleEquipe && tailleEquipe);  

    const [isGererFerme, setisGererFerme] = useState(isGF && isGF);
    const [isGererCalculs, setisGererCalculs] = useState(isGC && isGC);
    const [isVoirRapport, setisVoirRapport] = useState(isVR && isVR);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    



    const toggleAnimation = (value, setValue, animatedValue) => {
        const newValue = !value;
        Animated.timing(animatedValue, {
            toValue: newValue ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setValue(newValue);
    };

    

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
    



    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
            startWavyAnimation();
            try {

                if(type){
                    setuserCreatedAt(createdAt);
                    if(type === "staff"){
                        setEntrepriseEmail("");
                        setEntrepriseName("");
                        setEntrepriseMobile("");
                        setTailleEntreprise(0);
                    }
                    else{
                        if(entrepriseEmail === "" || !entrepriseEmail){
                            setEntrepriseEmail("");
                        }
                        else{
                            setEntrepriseEmail(entrepriseEmail);
                        }

                        if(entrepriseName === "" || !entrepriseName){
                            setEntrepriseName("");
                        }
                        else{
                            setEntrepriseName(entrepriseName);
                        }

                        if(entrepriseMobile === "" || !entrepriseMobile){
                            setEntrepriseMobile("");
                        }
                        else{
                            setEntrepriseMobile(entrepriseMobile);
                        }

                    }

                }
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally{
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);






 const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
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

                            {/* {
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
                                            onPress={()=>{
                                                setisAtleastOneModified(false);
                                                setisAtleastOneModified2(false);
                                                setisModifyClicked(false);
                                            }}  
                                        >
                                            <Feather name="check" size={19} color="#fff" />
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
                            } */}

                            <TouchableOpacity style={styles.addButton2} />

                            <Text style={styles.title}>
                                Profil
                            </Text>

                            <TouchableOpacity
                                style={styles.elipsisButton}
                                onPress={() => setIsPopupVisible(!isPopupVisible)}
                            >
                                <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                            </TouchableOpacity>
                        </View>
                        {
                            !isLoading ? 
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
                                    {
                                        entrepriseName && 
                                        <View style={styles.infoRow}>
                                        <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Entreprise :</Text>
                                        {
                                            !isModifyClicked ? 
                                            <Text style={styles.value}>{entrepriseName}&nbsp;&nbsp;</Text>
                                            :
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Entrez votre nom complet..."
                                                value={entrepriseName}
                                                onChangeText={(text) => {
                                                    setuserName(text);  
                                                    setisAtleastOneModified(true); 
                                                }}
                                            />
                                        }                                    
                                    </View>
                                    }
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Nom et prénom :</Text>
                                        {
                                            !isModifyClicked ? 
                                            <Text style={styles.value}>{userName}&nbsp;&nbsp;</Text>
                                            :
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Entrez votre nom complet..."
                                                value={userName}
                                                onChangeText={(text) => {
                                                    setuserName(text);  
                                                    setisAtleastOneModified(true); 
                                                }}
                                            />
                                        }                                    
                                    </View>

                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Adresse email :</Text>
                                        {
                                            !isModifyClicked ? 
                                            <Text style={styles.value}>{userEmail}&nbsp;&nbsp;</Text>
                                            :
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Entrez votre adresse email..."
                                                value={userEmail}
                                                onChangeText={(text) => {
                                                    setuserEmail(text);  
                                                    setisAtleastOneModified(true); 
                                                }}
                                            />
                                        }
                                    </View>

                                    {
                                        userMobile !== null && userMobile !== undefined && userMobile !== "" && 
                                        <View style={styles.infoRow}>
                                        <Text style={styles.label}>&nbsp;&nbsp;&nbsp;N° téléphone :</Text>
                                        {   
                                            !isModifyClicked ? 
                                            <Text style={styles.value}>{userMobile}&nbsp;&nbsp;</Text>
                                            :
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Entrez votre n° téléphone..."
                                                value={userMobile}
                                                onChangeText={(text) => {
                                                    setuserMobile(text);  
                                                    setisAtleastOneModified(true); 
                                                }}
                                            />
                                        }
                                    </View>
                                    }

                                   {
                                    job !== null &&  job !== "" && job !== undefined && 
                                    <View style={styles.infoRow}>
                                    <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Post :</Text>
                                    <Text style={styles.value}>
                                            {/* {userType.toLowerCase() === "admin" ? "Chef d'exploitation" : userType.toLowerCase() === "staff" ? "Personnel" : "Inconnu"}&nbsp;&nbsp; */}
                                            {job}
                                    </Text>
                                    {
                                        // !isModifyClicked ? 

                                        // :
                                        // <View style={styles.pickerContainer}>
                                        //     <Picker
                                        //         selectedValue={userType}
                                        //         onValueChange={(itemValue) => {setUserType(itemValue);setisAtleastOneModified(true);  }}
                                        //         style={styles.picker}
                                        //     >
                                        //         <Picker.Item style={{fontSize : 15,fontFamily : "Inter"}} color='#141414' label="Chef d'exploitation" value="admin" />
                                        //         <Picker.Item style={{fontSize : 15,fontFamily : "Inter"}} color='#141414' label="Personnel" value="staff" />
                                        //     </Picker>
                                        // </View>
                                    }
                                </View> 
                                   }
                                   
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Membre depuis le :</Text>
                                        <Text style={styles.value}>{formatDate(createdAt)}&nbsp;&nbsp;</Text>
                                    </View>

                                </View>




                                {/* { 
                                        userType !== "staff" ?
                                        <>
                                            <View  style={styles.HRHR}  />
                                            <View style={styles.infoContainer}>
                                                <Text style={styles.sectionTitle}>Entreprise agricole{isAtleastOneModified2 &&<Text style={styles.titleX} >&nbsp;&nbsp;(Édité)</Text>}</Text>
                                                <View style={styles.infoRow}>
                                                    <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Appelation :</Text>
                                                    {
                                                        !isModifyClicked ? 
                                                        <Text style={styles.value}>{XEntrepriseName === "" ? "---" : XEntrepriseName}&nbsp;&nbsp;</Text>
                                                        :
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Entrez le nom..."
                                                            value={XEntrepriseName}
                                                            onChangeText={(text) => {
                                                                setEntrepriseName(text);  
                                                                setisAtleastOneModified2(true); 
                                                            }}
                                                        />
                                                    }
                                                </View>
                                                <View style={styles.infoRow}>
                                                    <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Adresse email :</Text>
                                                    {
                                                        !isModifyClicked ? 
                                                        <Text style={styles.value}>{XEntrepriseEmail === "" ? "---" : XEntrepriseEmail}&nbsp;&nbsp;</Text>
                                                        :
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Entrez l'adresse email..."
                                                            value={XEntrepriseEmail}
                                                            onChangeText={(text) => {
                                                                setEntrepriseEmail(text);  
                                                                setisAtleastOneModified2(true); 
                                                            }}
                                                        />
                                                    }
                                                </View>
                                                <View style={styles.infoRow}>
                                                    <Text style={styles.label}>&nbsp;&nbsp;&nbsp;N° téléphone :</Text>
                                                    {
                                                        !isModifyClicked ? 
                                                        <Text style={styles.value}>{XEntrepriseMobile === "" ? "---" : XEntrepriseMobile}&nbsp;&nbsp;</Text>
                                                        :
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Entrez le n° téléphone"
                                                            value={XEntrepriseMobile}
                                                            onChangeText={(text) => {
                                                                setEntrepriseMobile(text);  
                                                                setisAtleastOneModified2(true); 
                                                            }}
                                                        />
                                                    }
                                                </View>
                                                <View style={styles.infoRow}>
                                                    <Text style={styles.label}>&nbsp;&nbsp;&nbsp;Effectif total :</Text>
                                                    {
                                                        XTaileEntreprise === 0 ? 
                                                        <Text style={styles.value}>---&nbsp;&nbsp;</Text>
                                                        :
                                                        <Text style={styles.value}>{XTaileEntreprise}&nbsp;employé{parseInt(XTaileEntreprise) === 1 ? "" : "s"}&nbsp;&nbsp;</Text>
                                                    }
                                                </View>
                                            </View>
                                        </>
                                        :
                                        <> */}
                                        {/* {
                                            !isLoading && 
                                            <>
                                                <View  style={styles.HRHR}  />
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.sectionTitle}>Gestion des permissions</Text>
                                                    <View onPress={()=>{ setisAtleastOneModified2(true);setisGererFerme(!isGererFerme); }}  style={styles.infoRowCust}>
                                                        <Text style={styles.value}>&nbsp;&nbsp;Gérer les fermes :</Text>
                                                        <ToggleButton 
                                                            isActive={isGererFerme} 
                                                            setIsActive={setisGererFerme}
                                                        />
                                                    </View>
                                                    <View onPress={()=>{  setisAtleastOneModified2(true);setisGererCalculs(!isGererCalculs);  }} style={styles.infoRowCust}>
                                                        <Text style={styles.value}>&nbsp;&nbsp;Gérer les calculs :</Text>
                                                        <ToggleButton 
                                                            isActive={isGererCalculs}   
                                                            setIsActive={setisGererCalculs}
                                                        />
                                                    </View>
                                                    <View onPress={()=>{  setisAtleastOneModified2(true);setisVoirRapport(!isVoirRapport); }} style={styles.infoRowCust}>
                                                        <Text style={styles.value}>&nbsp;&nbsp;Voir les rapports :</Text>
                                                        <ToggleButton 
                                                            isActive={isVoirRapport} 
                                                            setIsActive={setisVoirRapport}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        } */}
                                        {/* </> */}
                                {/* } */}
                            </> 
                            :        
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
        position : "relative"
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
        textAlign : "center"
    },
    titleX : {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#BE2929',
        fontStyle : "italic"
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
        fontSize: 16,
        fontWeight : "500",
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
        marginBottom : 20,
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
        fontFamily: 'InterBold',
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
        position : "absolute",
        bottom : 20,
        right : 20,
        left : 20,
        alignItems : "center",
        justifyContent : "center"

    },
    editButtonText: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#fff',
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
      

      addButton222: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#BE2929',
        alignItems: 'center',
        justifyContent: 'center',
      },
      


      skeletonHeaderButton: {
        width: 40,
        height: 40,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
    },
    skeletonImageContainer: {
        alignItems: 'center',
        marginBottom: 34,
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
        marginBottom: 18,
    },
    skeletonLabel: {
        height: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 6,
    },
    skeletonValue: {
        height: 12,
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
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#fff',
        textAlign : "center"
    },

    editButtonText22: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#BE2929',
        textAlign : "center"
    },
    input : { width : 150, padding : 0,height : 30, borderRadius : 0, borderColor : "gray", borderWidth : 1,paddingLeft : 10, paddingRight : 10, fontFamily : "Inter", fontSize : 14  },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 0,
        overflow: 'hidden',
        width: 150,
        height : 50,
        backgroundColor: '#FFFFFF', // Assurez un fond blanc
    },
    picker: {
        zIndex : 999,
        height: "100%", // Ajustez la hauteur pour un meilleur rendu
        color: '#141414', // Couleur du texte
        backgroundColor: 'transparent',
        fontSize : 15,fontFamily : "Inter"
    },
});