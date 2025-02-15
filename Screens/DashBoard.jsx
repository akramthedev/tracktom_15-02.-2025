import React, { useState, useEffect } from 'react';
import CustomizedPieChart from '../Components/CustomizedPieChart'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,ImageBackground,
  TouchableOpacity,
  Modal,Image,
  Alert
} from "react-native";
import { BlurView } from 'expo-blur'; 
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';  
import { useFonts } from 'expo-font';
import { ENDPOINT_API } from '../endpoint-backend';
import axios from "axios";
import PopUpNavigate from "../Components/PopUpNavigate";
import { BarChart} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");



 

const classColors = {
  classe_A: "#5D9B4B", // Dark Red
  classe_B: "#8DC63F", // Tomato
  classe_C: "#B9D92D", // Orange
  classe_D: "#FFA500", // Green Yellow
  classe_E: "#FF4D00", // Dark Green
  classe_F: "#D32F2F", // Dark Green
};

 








const combineFarmData = (farm) => {
  if (!farm.serres || farm.serres.length === 0) {
    return {
      totalTomatoes: 0,
      plants: 0,
      harvestRate: 0,
      tomatoColors: { classe_A: 0, classe_B: 0, classe_C: 0, classe_D: 0, classe_E: 0, classe_F: 0 },
    };
  }

  const aggregatedData = {
    totalTomatoes: 0,
    plants: 0,
    harvestRate: 0,
    tomatoColors: { classe_A: 0, classe_B: 0, classe_C: 0, classe_D: 0, classe_E: 0, classe_F: 0 },
  };

  farm.serres.forEach((greenhouse) => {
    aggregatedData.totalTomatoes += greenhouse.totalTomatoes || 0;
    aggregatedData.plants += greenhouse.plants || 0;
    aggregatedData.harvestRate += greenhouse.harvestRate || 0;
    Object.keys(aggregatedData.tomatoColors).forEach((key) => {
      aggregatedData.tomatoColors[key] += greenhouse.tomatoColors?.[key] || 0;
    });
  });

  aggregatedData.harvestRate = Math.round(aggregatedData.harvestRate / farm.serres.length);
  return aggregatedData;
};






const combineAllData = (data) => {
  if (!data || data.length === 0) {
    return {
      totalTomatoes: 0,
      plants: 0,
      harvestRate: 0,
      tomatoColors: { classe_A: 0, classe_B: 0, classe_C: 0, classe_D: 0, classe_E: 0, classe_F: 0 },
    };
  }

  const aggregatedData = {
    totalTomatoes: 0,
    plants: 0,
    harvestRate: 0,
    tomatoColors: { classe_A: 0, classe_B: 0, classe_C: 0, classe_D: 0, classe_E: 0, classe_F: 0 },
  };

  let totalGreenhouses = 0;

  data.forEach((farm) => {
    if (farm.serres) {
      totalGreenhouses += farm.serres.length;
      farm.serres.forEach((greenhouse) => {
        aggregatedData.totalTomatoes += greenhouse.totalTomatoes || 0;
        aggregatedData.plants += greenhouse.plants || 0;
        aggregatedData.harvestRate += greenhouse.harvestRate || 0;
        Object.keys(aggregatedData.tomatoColors).forEach((key) => {
          aggregatedData.tomatoColors[key] += greenhouse.tomatoColors?.[key] || 0;
        });
      });
    }
  });

  aggregatedData.harvestRate = totalGreenhouses > 0 ? Math.round(aggregatedData.harvestRate / totalGreenhouses) : 0;
  return aggregatedData;
};











export default function DashBoard({ route }) {

  const {setIsAuthenticated} = route.params;
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);
  const [chartType, setChartType] = useState("Bar");
  const [selectedFarmIndex, setSelectedFarmIndex] = useState(-1);
  const [selectedGreenhouseIndex, setSelectedGreenhouseIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [tomatoColors, setTomatoColors] = useState({
    classe_A: 0,
    classe_B: 0,
    classe_C: 0,
    classe_D: 0,
    classe_E: 0,
    classe_F: 0
  });
  









  useEffect(() => {
    if (data.length !== 0) {
      let newData;
  
      if (selectedFarmIndex === -1) {
        newData = combineAllData(data);
      } else if (selectedGreenhouseIndex === -1) {
        newData = combineFarmData(data[selectedFarmIndex]);
      } else {
        newData = data[selectedFarmIndex].serres[selectedGreenhouseIndex];
      }
  
      // Set the selected data and tomato colors
      setSelectedData(newData);
      setTomatoColors(newData.tomatoColors || {
        classe_A: 0,
        classe_B: 0,
        classe_C: 0,
        classe_D: 0,
        classe_E: 0,
        classe_F: 0
      });
    }
  }, [selectedFarmIndex, selectedGreenhouseIndex, data]);
  


  


  function mergeFarmData(farmsResponse, predictionsResponse) {
    if (!farmsResponse || !predictionsResponse) return [];

    console.warn("Farms Response:", farmsResponse);
    console.warn("Predictions Response:", predictionsResponse);

    return farmsResponse.map((farm) => {
      const greenhouses = farm.serres.map((serre) => {
        const predictions = predictionsResponse.filter((p) => p.serre_id === serre.id);

        const tomatoColors = predictions.reduce(
          (acc, p) => {
            acc.classe_A += parseInt(p.traitement_videos_sum_classe1) || 0;
            acc.classe_B += parseInt(p.traitement_videos_sum_classe2) || 0;
            acc.classe_C += parseInt(p.traitement_videos_sum_classe3) || 0;
            acc.classe_D += parseInt(p.traitement_videos_sum_classe4) || 0;
            acc.classe_E += parseInt(p.traitement_videos_sum_classe5) || 0;
            acc.classe_F += parseInt(p.traitement_videos_sum_classe6) || 0;
            return acc;
          },
          { classe_A: 0, classe_B: 0, classe_C: 0, classe_D: 0, classe_E: 0, classe_F: 0 }
        );

        return {
          id: serre.id,
          name: serre.name,
          totalTomatoes: Object.values(tomatoColors).reduce((a, b) => a + b, 0),
          plants: predictions.reduce((acc, p) => acc + (p.stemsDetected || 0), 0),
          harvestRate: Math.floor(Math.random() * (95 - 60) + 60),
          tomatoColors,
        };
      });

      return {
        id: farm.id,
        farmName: farm.nom_ferme,
        serres: greenhouses,
      };
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      let MergedData = [];

      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('authToken');

        const resp = await axios.get(`${ENDPOINT_API}fermes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.status === 200) {
          const resp2 = await axios.get(`${ENDPOINT_API}predictions`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (resp2.status === 200) {
            let farms = resp.data.fermes || []; 
            let predictions = resp2.data || []; 
          
            let MergedData = mergeFarmData(farms.length > 0 ? farms : [], predictions.length > 0 ? predictions : []);
          
            setData(MergedData);
          }
        }
        else{
          setData([]);

        }
      } catch (e) {
        console.log("Error fetching farm data:", e);
        Alert.alert('Oups, une erreur est survenue lors de la récupération des données.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



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
              isPopupVisible={isPopupVisible2}
              setIsPopupVisible={setIsPopupVisible2}   
          />
    


    {
      isLoading ? 
      <View style={{
        flex : 1, 
        backgroundColor : "white", 
        alignItems : "center", 
        justifyContent : "center", 
      }} >

{               
          !isPopupVisible2 && 
          <TouchableOpacity 
            onPress={() => setIsPopupVisible2(!isPopupVisible2)}
            disabled={isLoading}
            style={{

              position: "absolute", 
              right : 20, top : 40, backgroundColor : "rgba(0, 0, 0, 0.3)", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center"

            }} 
        >
          <Ionicons name="ellipsis-vertical" size={23} color="white" style={{textAlign : "center"}}  />
        </TouchableOpacity> 
        }



        <Text style={{color : "gray", fontSize : 14, textAlign : "center"}}  >
          Chargement des données...
        </Text>
      </View>
      :
      <>
        
      {
         data && data.length !== 0 ? 
         <>
      
      <PopUpNavigate  
              setIsAuthenticated={setIsAuthenticated}
              isPopupVisible={isPopupVisible2}
              setIsPopupVisible={setIsPopupVisible2}   
          />
    
      <Modal
        visible={isPopupVisible}
        animationType="fade" // Optional: A smoother transition
        transparent={true}
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrez par ferme et serre :</Text>

            <Picker
              selectedValue={selectedFarmIndex}
              onValueChange={(value) => {
                setSelectedFarmIndex(value);
                setSelectedGreenhouseIndex(-1); // Reset greenhouse selection to "All Greenhouses"
              }}
              style={{ backgroundColor: '#F1F1F1', marginBottom: 10 }}
            >
              <Picker.Item label="Toutes les Fermes" value={-1} />
              {data.map((farm, index) => (
                <Picker.Item key={farm.id} label={farm.farmName} value={index} />
              ))}
            </Picker>

            {selectedFarmIndex !== -1 && data[selectedFarmIndex]?.serres ? (
              <Picker
                selectedValue={selectedGreenhouseIndex}
                onValueChange={(value) => setSelectedGreenhouseIndex(value)}
                style={{ backgroundColor: '#F1F1F1', marginBottom: 10 }}
              >
                <Picker.Item label="Toutes les serres" value={-1} />
                {data[selectedFarmIndex]?.serres.map((greenhouse, index) => (
                  <Picker.Item key={greenhouse.id} label={greenhouse.name} value={index} />
                ))}
              </Picker>
            ) : (
              <Text>&nbsp;</Text>
            )}



            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsPopupVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    <View style={styles.container}>

      <ImageBackground
        source={require('../images/akram.jpg')} // Update the path to your image
        style={styles.backgroundImage}
      >

        {
          !isPopupVisible2 && 
          <TouchableOpacity 
            onPress={() => setIsPopupVisible2(!isPopupVisible2)}
            style={{

              position: "absolute", 
              right : 20, top : 40, backgroundColor : "rgba(0, 0, 0, 0.3)", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center"

            }} 
        >
          <Ionicons name="ellipsis-vertical" size={23} color="white" style={{textAlign : "center"}}  />
        </TouchableOpacity> 
        }

        <ScrollView horizontal contentContainerStyle={styles.cardsContent} >
          



        <View style={styles.cardContainer}>
            {/* Card for Total Tomatoes */}
            <View style={styles.card}>
              <BlurView intensity={110} tint="dark" style={{ borderRadius: 10, height: "100%", width: "100%" }}>
                <View style={styles.cardIcon}>
                  <Image
                    style={styles.imageLoggo}
                    source={require('../images/ak2.png')} // Update to your desired icon
                  />
                </View>
                {/* Display totalTomatoes */}
                <Text style={styles.cardValue}>{selectedData?.totalTomatoes || 0}</Text>
                <Text style={styles.cardTitle}>Total Tomates</Text>
              </BlurView>
            </View>

          
            <View style={styles.card}>
              <BlurView intensity={110} tint="dark" style={{ borderRadius: 10, height: "100%", width: "100%" }}>
                <View style={styles.cardIcon}>
                  <Image
                    style={styles.imageLoggo}
                    source={require('../images/ak3.png')} // Update to your desired icon
                  />
                </View>
                <Text style={styles.cardValue}>{selectedData?.plants || 0}</Text>
                <Text style={styles.cardTitle}>Total Tiges</Text>
              </BlurView>
            </View>
          </View>




          
        </ScrollView>
      </ImageBackground>



      <View style={styles.buttonRow}>
        {/* Chart Type Buttons */}
        <TouchableOpacity
          style={[styles.toggleButton, chartType === "Bar" && styles.activeButton]}
          onPress={() => setChartType("Bar")}
        >
          <Text style={[styles.toggleButtonText, chartType === "Bar" && styles.activeButtonText]} >Graphe de bars</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, chartType === "Pie" && styles.activeButton]}
          onPress={() => setChartType("Pie")}
        >
          <Text style={[styles.toggleButtonText, chartType === "Pie" && styles.activeButtonText]}  >Graphe circulaire</Text>
        </TouchableOpacity>

        {/* Ellipsis Button */}
        <TouchableOpacity
          style={styles.ellipsisButton}
          onPress={() => setIsPopupVisible(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={23} color="#141414" style={{textAlign : "center"}} />
        </TouchableOpacity>
      </View>

    
    









      {/* Chart Display */}
      <ScrollView style={styles.chartContainer}>
        {chartType === "Bar" ? (
          
          <>
            <BarChart
              data={{
                labels: ["Type 1", "Type 2", "Type 3", "Type 4", "Type 5", "Type 6"],
                datasets: [
                  {
                    data: Object.values(tomatoColors),
                  },
                ],
              }}
              width={screenWidth - 40}
              height={screenHeight * 0.39}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "white",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                color: () => "rgba(0, 0, 0, 1)",
                labelColor: () => "#141414",
              }}
              style={styles.chart}
            />

              <View style={styles.legendContainer}>
                {Object.keys(classColors).map((key) => {
                  const letter = key.replace("classe_", "");
                  const typeNumber = letter.charCodeAt(0) - 64;  
                  
                  return (
                    <View key={key} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: classColors[key] },
                        ]}
                      />
                      <Text style={styles.legendText}>
                        {`Type ${typeNumber}`} 
                      </Text>
                    </View>
                  );
                })}
              </View>


          </>
        
            
        ) : (
          
          <CustomizedPieChart
            tomatoColors={tomatoColors}
          />
        )}
      </ScrollView>
    </View>

         </>
        :
        <>

        <View style={{
          flex : 1, 
          backgroundColor : "white", 
          alignItems : "center", 
          justifyContent : "center", 
        }} >
          <Text style={{color : "gray", fontSize : 14, textAlign : "center"}}  >
            Aucune donnée.
          </Text>
        </View>  

        </>

    }

      </>
    }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  
   

  card: {
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height : 150, width : 130, 
    marginRight : 20, borderRadius :20
  },

  
   
  
  cardTitle: {
    color: "#fff",
    paddingLeft : 20,
    fontSize: 16,
  },

  cardIcon : {
    paddingLeft : 20,
    height : '30%',
    alignItems : "flex-start", justifyContent : "flex-end"
  },
  imageLoggo : {

    height : 33, width : 33, objectFit : "cover"

  },
  cardValue: {
    color: "#fff",
    fontSize: 33,
    paddingTop : 15,
    paddingLeft : 20,
    fontFamily:  "InriaBold", height : "50%", textAlign : "left"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal : 20,
    marginTop : 20
  },
  toggleButton: {
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    width: "40%",
    minHeight : 40, 
    alignItems : "center",justifyContent : "center",
  },
  activeButton: {
    backgroundColor: "#BE2929",
  },
  toggleButtonText: {
    color: "#141414",
    fontSize: 14,
    fontFamily: "Inter",
  },
  activeButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "InterBold",
  },
  ellipsisButton: {
    borderRadius : 40, 
    height : 40, 
    width : 40,
    alignItems : "center",justifyContent : "center",
    backgroundColor : "#F1F1F1"
  },
  modalContainer: {
    flex: 1, // Covers the full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Ensures semi-transparent background
  },
  modalContent: {
    width: "85%", // Adjusted width for better centering
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#141414",
    fontFamily: "InterBold",

  },
  closeButton: {
    backgroundColor: "#BE2929",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Inter",
  },
  chartContainer: {
    height : "30%",
    paddingHorizontal : 20,
    paddingVertical : 20
  },
 
  chart: {
    
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  legendColor: {
    width: 25,
    height: 25,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    fontFamily : "Inter",
    color: "#141414",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position : "relative"
  },
  cardsContent: {
    flexDirection: "row", // Ensure horizontal layout
    justifyContent: "center", // Center the cards horizontally
    alignItems: "flex-end", // Align cards at the bottom
    paddingRight : 20, 
    paddingLeft : 20,
    paddingBottom : 20     
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
