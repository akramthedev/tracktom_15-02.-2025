import React, { useState, useEffect, useRef } from 'react';
import PopUpNavigate from "../Components/PopUpNavigate";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';



function formatDate(dateString) {
    const date = new Date(dateString); // Convert to Date object
  
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad if necessary
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (1-based)
    const year = date.getUTCFullYear(); // Get year
  
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  }


export default function SingleCalcul({route}) {

    const {setIsAuthenticated} = route.params;

    
    const navigation = useNavigation();
    const { 
        id,
        classeTotale ,
        created_at ,
        nom_ferme,
        surface,
        commune,
        ferme_id ,
        serre_id ,
        nom_serre,
        stemsDetected ,
        traitement_videos_sum_classe1 ,
        traitement_videos_sum_classe2 ,
        traitement_videos_sum_classe3 ,
        traitement_videos_sum_classe4 ,
        traitement_videos_sum_classe5 ,
        traitement_videos_sum_classe6 ,
        traitement_videos_sum_classe7 
    } = route.params; 

    const [isLoading, setIsLoading] = useState(true);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const skeletonAnimation = useRef(new Animated.Value(0)).current;
    const [isDeleteClicked, setisDeleteClicked] = useState(false);
    const [isLoadingDelete, setisLoadingDelete] = useState(false);

 const [fontsLoaded] = useFonts({
          'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
          "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
          "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
          "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
          "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
        }); 






    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 555);

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

        return () => clearTimeout(timer);  
    }, []);


    const skeletonBackground = skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#f5f5f5'],
    });




    // const handleDelete = async ()=>{
    //     if(id){
    //         try{
    //             setisLoadingDelete(true);
    //             const resp = await axios.delete(`${ENDPOINT_API}`, {
    //                 Authori
    //             });
    //             if(resp.status ===   ){
    //                 Alert.alert("Cette prédiction a été supprimé avec succès.");
    //             }
    //             else{
    //                 Alert.alert("Une Erreur est survenue lors de la suppression de prédiction.");
    //             }                
    //         }
    //         catch(e){
    //             console.log(e.message);
    //         } finally{
    //             setisLoadingDelete(false);
    //         }
    //     }
    // }

    



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
                                        // onPress={handleDelete}
                                        disabled={isLoadingDelete}
                                    >
                                        <Text style={styles.confirmButtonText}>
                                        {
                                            isLoadingDelete ? "Suppression..." : "Supprimer"
                                        }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>


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
                    <Text style={styles.title}>Détails Calcul</Text>
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
                        {/* Skeleton for Details */}
                        <View style={styles.skeletonContainer}>
                            {[...Array(7)].map((_, index) => (
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
                                            : index === 4 ? '80%'
                                            : index === 5 ? '37%'
                                            : index === 6 ? '67%'
                                            : index === 7 ? '90%' : "100%"
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
                        {/* Details */}
                        <View style={styles.detailsContainer}>
                            <Text style={styles.sectionTitle}>Vue d'ensemble : </Text>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>&nbsp;&nbsp;Ferme :</Text>
                                <Text style={styles.value}>{nom_ferme ? nom_ferme : "---"}&nbsp;&nbsp;</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>&nbsp;&nbsp;Serre :</Text>
                                <Text style={styles.value}>{nom_serre ? nom_serre : "---"}&nbsp;&nbsp;</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>&nbsp;&nbsp;Surface :</Text>
                                <Text style={styles.value}>{surface ? <>{surface} m²</> : "---"}&nbsp;&nbsp;</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>&nbsp;&nbsp;Tomates détectées :</Text>
                                <Text style={styles.valueHighlight}>{classeTotale ? classeTotale : 0}&nbsp;tomates&nbsp;&nbsp;</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>&nbsp;&nbsp;Tiges détectées :</Text>
                                <Text style={styles.valueHighlight}>{stemsDetected ? stemsDetected : 0}&nbsp;tiges&nbsp;&nbsp;</Text>
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>&nbsp;&nbsp;Date du calcul :</Text>
                                <Text style={styles.value}>{created_at ? formatDate(created_at) : "---"}&nbsp;&nbsp;</Text>
                            </View>
                            <View style={styles.HRHR} />
                            
                            <Text style={styles.sectionTitle}>Répartition des tomates : </Text>
                            
                            <View style={styles.ushfuohodsuf} >
                                <View style={{
                                    display : "flex", 
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 15, 
                                }}  >
                                    <View style={{
                                        backgroundColor : "#5D9B4B", 
                                        height : 10, 
                                        width : 10, 
                                        borderRadius : 3, 
                                        marginLeft : 10, 
                                        marginRight : 10
                                    }} />
                                    <Text style={styles.TitleLabel2}>
                                        Classe A
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.valueHighlight}>
                                    {
                                        traitement_videos_sum_classe1 ? traitement_videos_sum_classe1 : 0
                                    }&nbsp;tomates&nbsp;&nbsp;
                                    </Text>
                                </View>
                            </View>


                            <View style={styles.ushfuohodsuf} >
                                <View style={{
                                    display : "flex", 
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 15, 
                                }}  >
                                    <View style={{
                                        backgroundColor : "#8DC63F", 
                                        height : 10, 
                                        width : 10, 
                                        borderRadius : 3, 
                                        marginLeft : 10, 
                                        marginRight : 10
                                    }} />
                                    <Text style={styles.TitleLabel2}>
                                        Classe B
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.valueHighlight}>
                                    {
                                        traitement_videos_sum_classe2 ? traitement_videos_sum_classe2 : 0
                                    }&nbsp;tomates&nbsp;&nbsp;
                                    </Text>
                                </View>
                            </View>


                            <View style={styles.ushfuohodsuf} >
                                <View style={{
                                    display : "flex", 
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 15, 
                                }}  >
                                    <View style={{
                                        backgroundColor : "#B9D92D", 
                                        height : 10, 
                                        width : 10, 
                                        borderRadius : 3, 
                                        marginLeft : 10, 
                                        marginRight : 10
                                    }} />
                                    <Text style={styles.TitleLabel2}>
                                        Classe C
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.valueHighlight}>
                                    {
                                        traitement_videos_sum_classe3 ? traitement_videos_sum_classe3 : 0
                                    }&nbsp;tomates&nbsp;&nbsp;
                                    </Text>
                                </View>
                            </View>



                            <View style={styles.ushfuohodsuf} >
                                <View style={{
                                    display : "flex", 
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 15, 
                                }}  >
                                    <View style={{
                                        backgroundColor : "#FFA500", 
                                        height : 10, 
                                        width : 10, 
                                        borderRadius : 3, 
                                        marginLeft : 10, 
                                        marginRight : 10
                                    }} />
                                    <Text style={styles.TitleLabel2}>
                                        Classe D
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.valueHighlight}>
                                    {
                                        traitement_videos_sum_classe4 ? traitement_videos_sum_classe4 : 0
                                    }&nbsp;tomates&nbsp;&nbsp;
                                    </Text>
                                </View>
                            </View>



                            <View style={styles.ushfuohodsuf} >
                                <View style={{
                                    display : "flex", 
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 15, 
                                }}  >
                                    <View style={{
                                        backgroundColor : "#FF4D00", 
                                        height : 10, 
                                        width : 10, 
                                        borderRadius : 3, 
                                        marginLeft : 10, 
                                        marginRight : 10
                                    }} />
                                    <Text style={styles.TitleLabel2}>
                                        Classe E
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.valueHighlight}>
                                    {
                                        traitement_videos_sum_classe5 ? traitement_videos_sum_classe5 : 0
                                    }&nbsp;tomates&nbsp;&nbsp;
                                    </Text>
                                </View>
                            </View>



                            <View style={styles.ushfuohodsuf} >
                                <View style={{
                                    display : "flex", 
                                    flexDirection : "row", 
                                    alignItems : "center", 
                                    marginBottom : 15, 
                                }}  >
                                    <View style={{
                                        backgroundColor : "#D32F2F", 
                                        height : 10, 
                                        width : 10, 
                                        borderRadius : 3, 
                                        marginLeft : 10, 
                                        marginRight : 10
                                    }} />
                                    <Text style={styles.TitleLabel2}>
                                        Classe F
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.valueHighlight}>
                                    {
                                        traitement_videos_sum_classe6 ? traitement_videos_sum_classe6 : 0
                                    }&nbsp;tomates&nbsp;&nbsp;
                                    </Text>
                                </View>
                            </View>



                        </View>

                        
                    </>
                )}

                            {/* <TouchableOpacity style={styles.deleteButton}
                                onPress={()=>{
                                    setisDeleteClicked(true);
                                }}
                            >
                                <Text style={styles.deleteButtonText}>Supprimer le calcul</Text>
                            </TouchableOpacity> */}
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
        position : "absolute", 
        bottom : 20,
        left : 20, 
        width : "100%"
    },
    deleteButtonText: {
        fontFamily: 'InterBold',
        fontSize: 15,
        color: '#BE2929',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
    HRHR : {
        height : 1, 
        width : '90%', 
        margin : "auto" ,
        backgroundColor : "transparent", 
        borderTopColor : "gainsboro", 
        borderTopWidth : 1, 
        marginBottom : 20, 
        marginTop : 20,
    },

    sectionTitle: {
        fontFamily: 'InterBold',
        fontSize: 17,
        fontWeight : "600",
        color: '#141414',
        marginBottom: 20,
    },
    ushfuohodsuf : {
        width : 'auto', 
        alignItems : "center", 
        justifyContent : "space-between", 
        flexDirection : "row"
    },  

});

