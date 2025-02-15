import React, { useState, useRef, useCallback } from 'react';
import PopUpNavigate from "../Components/PopUpNavigate";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated,
    Image,Modal,
    TextInput,
    Alert
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons,Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENDPOINT_API} from "../endpoint-backend";

export default function SingleFarm({route}) {

    const {setIsAuthenticated} = route.params;

    const navigation = useNavigation();
    const { id } = route.params;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const skeletonAnimation = useRef(new Animated.Value(0)).current;
    const [isModifyClicked, setisModifyClicked] = useState(false);
    const [isDeleteClicked, setisDeleteClicked] = useState(false);


    const [ferme , setFerme] = useState({});
    const [serres , setSerres] = useState([]);
    const [fermeName , setFermeName ] = useState(null);
    const [surface , setSurface] = useState(null);
    const [commune , setCommune ] = useState(null);


 const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
        }); 

 
        

        useFocusEffect(
            useCallback(() => {
                const fetchData = async () => {
                    try {
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
          
                        const token = await AsyncStorage.getItem('authToken');
          
                        const resp = await axios.get(`${ENDPOINT_API}fermes/${id}`, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
          
                        console.log("resp Ferme ===>", resp);
          
                        if (resp.status === 200) {
                            setFermeName(resp.data.fermes.nom_ferme);
                            setCommune(resp.data.fermes.commune);
                            setSurface(resp.data.fermes.surface);
                            setSerres(resp.data.fermes.serres);
                        }
                        
                         
                    } catch (e) {
                        console.log("error Ferme ===>", e);
                    } finally {
                        const timer = setTimeout(() => {
                            setIsLoading(false);
                        }, 2000);
          
                        return () => clearTimeout(timer);
                    }
                };
          
                fetchData();
          
                return () => {};  // Cleanup function (optional)
            }, [id]) // Depend on `id` to refetch when it changes
          );
          


    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);


    const handleSaveData = async()=>{
        setIsLoadingUpdate(true);
        const token = await AsyncStorage.getItem('authToken');
            try{
              let data = {
                nom_ferme : fermeName, 
                surface : surface , 
                commune: commune 
              }
              
              const resp = await axios.put(`${ENDPOINT_API}fermes/${id}`, data, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if(resp.status === 200){
                setIsLoadingUpdate(false);
                setisModifyClicked(false);
              }
              else{
                setIsLoadingUpdate(false);
                Alert.alert("Une erreur est suvenue lors de la modification de la ferme.")
              }
            }
            catch(e){
                setIsLoadingUpdate(false);
                console.log(e.message);
              Alert.alert("Une erreur est suvenue lors de la modification de la ferme.")     
            } 
       }


    const skeletonBackground = skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#f5f5f5'],
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>{
                
                console.log(item);
                
                navigation.navigate('SingleSerre', { 
                    id: item.id,
                    created_at : item.created_at, 
                    nameSerre : item.name 
                })

            }}
            style={styles.card}
            key={item.id}
        >
            <View style={styles.infosContainer}>
                <Text style={styles.kakakakakaka}>{item.name}</Text>
            </View>
            <View style={styles.carretRight}>
                <Ionicons name="chevron-forward" size={20} color="gray" />
            </View>
        </TouchableOpacity>
    );



    const handleDelete = async()=>{
        try{
            const token = await AsyncStorage.getItem('authToken');
            const resp = await axios.delete(`${ENDPOINT_API}fermes/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if(resp.status === 200){
              console.log("resp  =========>",resp);
              navigation.navigate("MesFermes")
            }
        }
        catch(e){
            console.log(e.message);
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
            


            <Modal
                transparent={true}
                visible={isDeleteClicked}
                animationType="fade"
                onRequestClose={() => setisDeleteClicked(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                        Confirmer la suppression
                        </Text>
                        <Text style={styles.modalMessage}>
                        Cette action supprimera l'élément définitivement.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setisDeleteClicked(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleDelete}
                            >
                                <Text style={styles.confirmButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <View style={styles.container}>
                <View style={styles.header}>
                    
                    
                {
                    !isLoading ?
                            <>
                            {
                                !isModifyClicked ? 
                                <>
                                    <View
                                        style={{
                                            position : "relative"
                                        }}
                                    >
                                        <TouchableOpacity 
                                            style={styles.addButton222}
                                            disabled={isLoadingUpdate}
                                            onPress={()=>{setisModifyClicked(true)}}
                                        >
                                            <Feather name="edit-2" size={17} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 20, 
                                                backgroundColor: '#BE2929',
                                                borderWidth : 1,
                                                alignItems: 'center',
                                                borderColor : "#BE2929",
                                                justifyContent: 'center',
                                                position : "absolute", left : 42
                                            }}
                                            disabled={isLoadingUpdate || isLoading}
                                            onPress={()=>{
                                                setisDeleteClicked(true);
                                            }}  
                                        >
                                            <Feather name="trash" size={19} color="white" />
                                        </TouchableOpacity> 
                                    </View>
                                </>
                                :
                                <>
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
                                                alignItems: 'center',
                                                borderColor : "#BE2929",
                                                justifyContent: 'center',
                                                position : "absolute", left : 42
                                            }}
                                            onPress={()=>{
                                                setisModifyClicked(false);
                                            }}  
                                        >
                                            <Feather name="x" size={19} color="white" />
                                        </TouchableOpacity> 
                                    </View>
                                </>
                            }
                            </>
                                    :
                                        <TouchableOpacity 
                                            style={styles.addButton2222}
                                        />
                }

                    <Text style={styles.title}>Détails Ferme</Text>
                    <TouchableOpacity
                        style={styles.elipsisButton}
                        onPress={() => setIsPopupVisible(!isPopupVisible)}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <>
                        <View style={styles.skeletonImageContainer}>
                            <Animated.View
                                style={[
                                    styles.skeletonProfileImage,
                                    {
                                        backgroundColor: skeletonBackground,
                                    },
                                ]}
                            />
                        </View>

                        <View style={styles.skeletonDetailsContainer}>
                            <View style={styles.ViewLabel} />
                            <View style={styles.ViewLabel} />   
                            {[...Array(4)].map((_, index) => (
                                <View key={index} style={styles.skeletonRow}>
                                    <Animated.View
                                        style={[
                                            styles.skeletonLabel,
                                            {
                                                backgroundColor: skeletonBackground,
                                                width:
                                                    index === 0
                                                        ? '30%'
                                                        : index === 1
                                                        ? '23%'
                                                        : index === 2
                                                        ? '38%'
                                                        : '44%',
                                            },
                                        ]}
                                    />
                                    <Animated.View
                                        style={[
                                            styles.skeletonValue,
                                            {
                                                backgroundColor: skeletonBackground,
                                                width:
                                                    index === 0
                                                        ? '20%'
                                                        : index === 1
                                                        ? '49%'
                                                        : index === 2
                                                        ? '38%'
                                                        : '30%',
                                            },
                                        ]}
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.skeletonSerresContainer}>
                            <Animated.View
                                style={[
                                    styles.skeletonTitle,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                            {[...Array(3)].map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.skeletonSerre,
                                        { backgroundColor: skeletonBackground },
                                    ]}
                                />
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{
                                    uri: 'https://www.jardinet.fr/public/images/galerie/2024/07/Tout-savoir-sur-la-tomate-1__800x800.jpg',
                                }}
                                style={styles.profileImage}
                            />
                        </View>

                        <View style={styles.detailsContainer}>
                            <View style={styles.ViewLabel} />
                            <View style={styles.ViewLabel} />         
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Appelation :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{fermeName}</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez le nom..."
                                            value={fermeName}
                                            onChangeText={(text) => {
                                                setFermeName(text);  
                                            }}
                                        />
                                    }
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Superficie :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{surface}&nbsp;Hectares</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nombre de Hectare..."
                                            value={surface}
                                            onChangeText={(text) => {
                                                setSurface(parseInt(text));  
                                            }}
                                        />
                                    }
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Localisation :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{commune}</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez la superficie..."
                                            value={commune}
                                            onChangeText={(text) => {
                                                setCommune(text);  
                                            }}
                                        />
                                    }
                            </View>
                        </View>
                        
                        <View style={styles.ViewLabel} />

                        <View style={styles.serresHeader}>
                            <Text style={styles.TitleLabel2462}>Serres associées : {serres.length}</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AjouterSerre',{ idFerme: id })}
                                style={styles.addSerre}
                            >
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={serres}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
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
        marginTop: 10,
    },
    ViewLabel: {
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    TitleLabel: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#141414',
    },
    TitleLabel2: {
        fontFamily: 'InterBold',
        fontSize: 16,
        color: '#141414',
    },
    TitleLabel2462 :  {
        fontFamily: 'InterBold',
        fontSize: 16,
        color: '#141414',
        width : 200,
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
        width : "100%", 
    },
    infosContainer : {
        width : "auto", 
        height : "auto",
        textAlign : "left",
    },
    card: {
        borderRadius: 0,
        height : 40,
        marginBottom : 2,
        alignItems : "center",
        paddingRight : 10,
        paddingLeft : 10,
        justifyContent : "space-between",
        flexDirection :"row",
    },
    kakakakakaka : {
        fontFamily : "Inter", 
        fontSize : 15
    },

    serresHeader : {
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    skeletonImageContainer: { alignItems: 'center', marginBottom: 20 },
    skeletonProfileImage: { width: 106, height: 106, borderRadius: 15 },
    skeletonDetailsContainer: { marginBottom: 20 },
    skeletonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    skeletonLabel: { height: 15, borderRadius: 6 },
    skeletonValue: { height: 15, borderRadius: 6 },
    skeletonSerresContainer: { marginTop: 20 },
    skeletonTitle: { height: 20, width: '60%', borderRadius: 6, marginBottom: 15 },
    skeletonSerre: { height: 40, borderRadius: 6, marginBottom: 10 },

    addButton222: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#BE2929',
        alignItems: 'center',
        justifyContent: 'center',
      },
      addButton2222 : {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },

      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 18,
        paddingTop : 20,
        paddingBottom : 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 17,
        fontFamily: 'InterBold',
        color: '#141414',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 15,
        fontFamily: 'Inter',
        color: '#141414',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E6E6E6',
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontFamily: 'Inter',
        color: '#141414',
    },
    confirmButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#BE2929',
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 15,
        fontFamily: 'InterBold',
        color: 'white',
    },
    input : { width : 150, padding : 0,height : 30, borderRadius : 0, borderColor : "gray", borderWidth : 1,paddingLeft : 10, paddingRight : 10, fontFamily : "Inter", fontSize : 14  },

});
