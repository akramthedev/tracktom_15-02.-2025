import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import Screens
import Dashboard from "./Screens/DashBoard";
import Home from './Screens/Home';
import Login from './Screens/Login';
import Register from './Screens/Register';
import SplashScreen from './Screens/SplashScreen';
import MesCalculs from './Screens/MesCalculs';
import SingleCalcul from './Screens/SingleCalcul';
import AjouterCalcul from './Screens/AjouterCalcul';
import Profil from './Screens/Profil';
import MesPersonnels from './Screens/MesPersonnels';
import AjouterPersonnel from './Screens/AjouterPersonnel';
import AjouterClient from './Screens/AjouterClient';
import MesFermes from './Screens/MesFermes';
import AjouterFerme from './Screens/AjouterFerme';
import MesClients from './Screens/MesClients';
import SingleFarm from "./Screens/SingleFarm";
import SingleSerre from './Screens/SingleSerre';
import AjouterSerre from './Screens/AjouterSerre';
import NouvellesDemandes from './Screens/NouvellesDemandes';
import SingleDemande from './Screens/SingleDemande';
import ProfilOthers from "./Screens/ProfilOthers";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  
  const handleLogin = async () => {
    setIsAuthenticated(true);
  };

 


  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen 
                name="Login" 
                component={(props) => <Login {...props} onLogin={handleLogin} />} 
              />
              <Stack.Screen name="Register" component={Register} />
            </>
          ) : (
            <>
            <Stack.Screen name="MesCalculs" component={MesCalculs} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="Dashboard" component={Dashboard} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="SingleCalcul" component={SingleCalcul} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="AjouterCalcul" component={AjouterCalcul} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="Profil" component={Profil} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="ProfilOthers" component={ProfilOthers} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="MesPersonnels" component={MesPersonnels} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="AjouterPersonnel" component={AjouterPersonnel} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="AjouterClient" component={AjouterClient} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="MesFermes" component={MesFermes} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="AjouterFerme" component={AjouterFerme} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="MesClients" component={MesClients} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="SingleFarm" component={SingleFarm} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="SingleSerre" component={SingleSerre} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="AjouterSerre" component={AjouterSerre} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="NouvellesDemandes" component={NouvellesDemandes} initialParams={{ setIsAuthenticated }} />
            <Stack.Screen name="SingleDemande" component={SingleDemande} initialParams={{ setIsAuthenticated }} />
            </>

          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
