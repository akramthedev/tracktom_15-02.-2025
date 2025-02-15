import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,TextInput
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation  } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import {ENDPOINT_API} from "../endpoint-backend";
import axios from "axios";   
import AsyncStorage from '@react-native-async-storage/async-storage';






export default function AjouterSerre({route}) {

    const {setIsAuthenticated} = route.params;


    const navigation = useNavigation();
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
    const [videoUri, setVideoUri] = useState(null);
    const [videoInfo, setVideoInfo] = useState({ name: null, duration: null });
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [nombreMetre,setnombreMetre] = useState(0);
    const [NameSerre,setNameSerre] = useState("");
    const { idFerme } = route.params;
    const [isLoading,setloading] = useState(false);

 const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
        }); 







        const handleSubmit = async () => {

        if (!NameSerre) {
            Alert.alert("Le champs nom de serre ne peux pas etres vide.");
            return;
        }

        try{
            setloading(true);
            const token = await AsyncStorage.getItem('authToken');

            let data = {
                name : NameSerre, 
                superficie : parseInt(nombreMetre), 
                ferme_id : idFerme
            }

            console.log("data" , data);

            const resp = await axios.post(`${ENDPOINT_API}serres`, data, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log("resp Serre ===>" ,resp);
            if(resp.status === 201){
                console.log(resp.data);
                setloading(false);
                navigation.goBack();
            }
            else{
                setloading(false);
                Alert.alert("Une erreur est survenue lors de la création de la serre.");
            }
          }
    
        catch(e){
            setloading(false);
            Alert.alert("Une erreur est survenue lors de la création de la serre.");
            console.log(e.data);
            console.warn(e.message);
        }

    }

   
    
    

    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000); 
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}m ${secs}s`;
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
                <TouchableOpacity 
                    style={styles.returnButton}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#141414" />
                </TouchableOpacity>
                <Text style={styles.title}>Nouvelle Serre</Text>
                <TouchableOpacity 
                    onPress={() => setIsPopupVisible(!isPopupVisible)}
                    style={styles.elipsisButton}
                >                    
                    <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                </TouchableOpacity>
            </View>


            <View style={styles.formContainer}>

                <Text style={styles.label}>
                    Appelation&nbsp;<Text style={styles.highlight} >*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    value={NameSerre}
                    onChangeText={setNameSerre}
                    placeholder="Veuillez saisir la superficie..."
                    keyboardType="default"
                />

                <Text style={styles.label}>
                    Superficie en m²
                </Text>
                <TextInput
                    style={styles.input}
                    value={nombreMetre}
                    onChangeText={setnombreMetre}
                    placeholder="Veuillez saisir la superficie..."
                    keyboardType="default"
                />



            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleSubmit} disabled={isLoading} >
            {
                isLoading ? 
                <>
                <Text style={styles.createButtonText}>Création en cours...</Text>
                </>
                :
                <>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Créer la nouvelle serre</Text>
                </>
            }
            </TouchableOpacity>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,      paddingBottom : 0

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
    formContainer: {
        marginTop: 20,
    },
    label: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#141414',
        marginBottom: 10,
    },
    required: {
        color: '#BE2929',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        height : 50,
        marginBottom: 20,
    },
    picker: {
        fontFamily: 'Inter',
        color: '#141414',
    },
    button: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        height : 50,
        alignItems : "center",
        justifyContent : "center",
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    videoInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    videoInfoText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#141414',
        marginBottom: 5,
    },
    boldText: {
        fontFamily: 'InterBold',
    },
    createButton: {
        backgroundColor: '#BE2929',
        borderRadius: 8,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        left: 20,
    },
    createButtonText: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#fff',
        marginLeft: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
    },

    highlight: {
        color: '#BE2929',
        fontFamily: 'InterBold',
      },
});
