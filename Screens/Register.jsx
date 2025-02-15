import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import axios from "axios";
import { ENDPOINT_API } from '../endpoint-backend';




export default function Register({ route }) {
  
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messageAxiosrequest , setmessageAxiosrequest] = useState(null);
    const [modalVisibleError , setModalVisibleError] = useState(false);

    
    const [fontsLoaded] = useFonts({
      'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
      "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
      "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
      "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
      "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
    }); 
    const navigation = useNavigation();

    const handleRegister = async () => {

      if (!email || !password) {
        console.log("Enter email and password !");
        return;
      }

      try {
        const req = await axios.post(`${ENDPOINT_API}register`, {
          name: fullName,
          email: email,
          password: password,
          job: "IT",
          telephone: "123-456-7890",
          entreprise: "PCS AGRI",
          password_confirmation: password
        });

        console.warn(req.status);

        if (req.status === 201) {
          setEmail("");
          setPassword("");
          setfullName("");
          setmessageAxiosrequest("Votre demande est en cours de traitement, veuillez revenir d'ici 24H");
          setModalVisibleError(true);

        }
        else{
          setmessageAxiosrequest("Oups, une erreur est survnue lors de la création de votre compte.");
          setModalVisibleError(true);
        }

      } catch (error) {
        setmessageAxiosrequest("Oups, une erreur est survnue : "+error.message);
        setModalVisibleError(true);
        console.log("error  ====>",error);
      }

    }


    if (!fontsLoaded) {
        return null;
    }
    return (
        <ImageBackground
          source={require('../images/akram.jpg')}  
          style={styles.background}
        >
        <View style={styles.overlay}>







                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisibleError}
                    onRequestClose={() => {
                      setModalVisibleError(!modalVisibleError);
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>{messageAxiosrequest}</Text>
                        <Pressable
                          style={[styles.btnModel, styles.buttonClose]}
                          onPress={() => setModalVisibleError(!modalVisibleError)}
                        >
                          <Text style={styles.textStyle}>{messageAxiosrequest === "Votre demande est en cours de traitement, veuillez revenir d'ici 24H" ? "OK, bien noté" : "Réessayer"}</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>


            <Text style={styles.title}>Rejoignez-nous !</Text>
            <Text style={styles.subtitle}>
                Améliorez vos rendements dès maintenant.
            </Text>

            
            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                Nom et prénom <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Veuillez saisir votre nom et prénom..."
                placeholderTextColor="gray"
                value={fullName}
                onChangeText={setfullName}
            />
            </View>

            
            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                Adresse email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Veuillez saisir votre email..."
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                Mot de passe <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Veuillez saisir votre mot de passe..."
                placeholderTextColor="gray"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            </View>
            <Text style={styles.infos}>
                En créant un compte, vous reconnaissez avoir lu et accepté notre politique.
            </Text>

            <View style={styles.lastContainer} >
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>S'inscrire maintenant</Text>
                    <Ionicons name="chevron-forward" size={19} color="#fff" />
                </TouchableOpacity>

                <Text 
                  style={styles.signupText}
                  onPress={async ()=>{
                    navigation.navigate('Login');
                  }}
                >
                    Déja un compte ? <Text style={styles.signupLink}>connectez-vous</Text>
                </Text>
            </View>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.57)', 
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'InriaBold',
    fontSize: 35,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 70,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  infos : {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    textAlign : "center"
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height : 53,
    paddingRight : 20,
    paddingLeft : 20,
    fontSize: 15,
    fontWeight : "300",
    fontFamily: 'Inter',
  },
  lastContainer : {
    position : "absolute", 
    bottom : 20, 
    right : 20,
    left : 20
},
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#BE2929",
    borderRadius: 11,
    height : 53, 
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily : "Inter",
    fontSize : 17,
    marginBottom : 3,
    marginRight : 7, 
    fontWeight : "300"
  },
  signupText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: '#fff',
    fontWeight : "600",
    textDecorationLine: 'underline',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.567)',  // Arrière-plan noir semi-transparent
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  btnModel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "red",
    borderRadius: 11,
    padding : 10,
  },
  textStyle:{
    color:"white"
  },
  buttonClose: {
    backgroundColor: "tomato",
  },
});
