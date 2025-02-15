import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';



export default function AjouterClient({route}) {
 
    const {setIsAuthenticated} = route.params;
    
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [imageInfo, setImageInfo] = useState({ name: null, resolution: null, type: null });
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');




   const [fontsLoaded] = useFonts({
            'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
            "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
            "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
            "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
            "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
          }); 
    const selectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Requise', 'Accès à la galerie requis pour sélectionner une image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            const width = result.assets[0].width;
            const height = result.assets[0].height;
            const type = result.assets[0].type;
            const name = imageUri.split('/').pop();

            setImageUri(imageUri);
            setImageInfo({
                name: name || 'Nom inconnu',
                resolution: `${width} x ${height}`,
                type: type || 'Type inconnu',
            });
        }
    };



    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <PopUpNavigate setIsAuthenticated={setIsAuthenticated} isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible}  />

            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#141414" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Nouveau Client</Text>
                    <TouchableOpacity
                        onPress={() => setIsPopupVisible(!isPopupVisible)}
                        style={styles.elipsisButton}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>

                    <Text style={styles.label}>
                        Nom et prénom <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Veuillez saisir le nom et prénom..."
                        keyboardType="default"
                    />


                    <Text style={styles.label}>
                        Adresse email <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Veuillez saisir l'adresse email..."
                        keyboardType="email-address"
                    />


                    <Text style={styles.label}>
                        Mot de passe <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Veuillez saisir le mot de passe..."
                        secureTextEntry={true}
                    />


                    <Text style={styles.label}>N° de téléphone</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Veuillez saisir le numéro de téléphone..."
                        keyboardType="phone-pad"
                    />


                    <Text style={styles.label}>
                        Image
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={selectImage}>
                        <Text style={styles.buttonText}>Importer depuis la galerie</Text>
                    </TouchableOpacity>


                    {imageUri && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={styles.boldText}>
                            <MaterialIcons name="check" size={15} color="gray" style={{ marginTop: 3 }} />
                            &nbsp;Sélection de l'image réussie
                            </Text>
                            <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => {
                                setImageUri(null);
                                setImageInfo({ name: null, resolution: null, type: null });
                            }}
                            >
                            <MaterialIcons name="close" size={15} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}

                </View>

            </ScrollView>

            <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Créer le nouveau client</Text>
            </TouchableOpacity>
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
        alignItems: "center",
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
        alignItems: "center",
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
    button: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        paddingVertical: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    imageInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    imageInfoText: {
        fontFamily: 'Inter',
        fontSize: 15,
        color: '#141414',
        marginBottom: 5,
    },
    boldText: {
        fontFamily: 'Inter',
        fontSize : 15,
        color : "gray"
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
    deleteButton: {
        backgroundColor: '#BE2929',
        borderRadius: 50,
        height : 24, width : 24,
        alignItems: 'center',
        justifyContent: 'center',
        position : 'absolute',
        right : 0
    },
});
