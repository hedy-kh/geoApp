// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import Svg, { Path, G, Text as SvgText } from "react-native-svg";
// import useSound from "../../../../../hooks/useSound";

// const Hardtwo = () => {
//   const { winSound, wrongAnswerSound } = useSound();
//   const [selectedResource, setSelectedResource] = useState(null);
//   const [placedResources, setPlacedResources] = useState({});
//   const [feedback, setFeedback] = useState(
//     "اختر مورداً من الأسفل ثم انقر على الدولة الصحيحة"
//   );
//   const [isCompleted, setIsCompleted] = useState(false);

//   // Updated resources - each resource can be placed in multiple countries
//   const resources = [
//     {
//       id: "oil",
//       name: "النفط",
//       icon: "🛢️",
//       countries: ["LIBYA", "ALGERIA"],
//       maxCountries: 2,
//     },
//     {
//       id: "gas",
//       name: "الغاز الطبيعي",
//       icon: "🔥",
//       countries: ["ALGERIA", "LIBYA"],
//       maxCountries: 2,
//     },
//     {
//       id: "phosphate",
//       name: "الفوسفات",
//       icon: "⚗️",
//       countries: ["MOROCCO", "TUNISIA"],
//       maxCountries: 2,
//     },
//     {
//       id: "fish",
//       name: "الأسماك",
//       icon: "🐟",
//       countries: ["MAURITANIA", "MOROCCO"],
//       maxCountries: 2,
//     },
//     {
//       id: "solar",
//       name: "الطاقة الشمسية",
//       icon: "☀️",
//       countries: ["ALGERIA", "MOROCCO"],
//       maxCountries: 2,
//     },
//   ];

//   const countryNames = {
//     MOROCCO: "المغرب",
//     ALGERIA: "الجزائر",
//     TUNISIA: "تونس",
//     LIBYA: "ليبيا",
//     MAURITANIA: "موريتانيا",
//   };

//   // Updated positions for larger map
//   const countryPositions = {
//     MOROCCO: { x: 950, y: 295 },
//     ALGERIA: { x: 1000, y: 315 },
//     TUNISIA: { x: 1040, y: 290 },
//     LIBYA: { x: 1090, y: 325 },
//     MAURITANIA: { x: 930, y: 375 },
//   };

//   // FIXED: Calculate how many times a resource has been placed
//   const getResourcePlacementCount = (resourceId) => {
//     return Object.keys(placedResources).filter((key) =>
//       key.startsWith(`${resourceId}_`)
//     ).length;
//   };

//   // Check if a resource can be placed in a specific country
//   const canPlaceResourceInCountry = (resourceId, country) => {
//     const resource = resources.find((r) => r.id === resourceId);
//     if (!resource || !resource.countries.includes(country)) return false;

//     const placedCount = getResourcePlacementCount(resourceId);
//     return placedCount < resource.maxCountries;
//   };

//   // Check if resource is already placed in this specific country
//   const isResourcePlacedInCountry = (resourceId, country) => {
//     return Object.entries(placedResources).some(
//       ([key, value]) => key.startsWith(`${resourceId}_`) && value === country
//     );
//   };

//   useEffect(() => {
//     const allResourcesPlaced = resources.every((resource) => {
//       const placedCount = getResourcePlacementCount(resource.id);
//       return placedCount === resource.maxCountries;
//     });

//     if (allResourcesPlaced) {
//       winSound();
//       setIsCompleted(true);
//       setFeedback("🎉 ممتاز! لقد وضعت جميع الموارد في الأماكن الصحيحة!");
//     }
//   }, [placedResources]);

//   const handleResourceSelect = (resource) => {
//     const placedCount = getResourcePlacementCount(resource.id);
//     if (placedCount >= resource.maxCountries) return;

//     setSelectedResource(resource);
//     setFeedback(
//       `اختر الدولة الصحيحة لـ ${resource.name} (${placedCount}/${resource.maxCountries})`
//     );
//   };

//   const onCountryPress = (country) => {
//     if (!selectedResource) {
//       setFeedback("⚠️ الرجاء اختيار مورد من الأسفل أولاً");
//       return;
//     }

//     if (isResourcePlacedInCountry(selectedResource.id, country)) {
//       setFeedback(`⚠️ هذا المورد موجود بالفعل في ${countryNames[country]}`);
//       return;
//     }

//     const isCorrect = selectedResource.countries.includes(country);
//     const canPlace = canPlaceResourceInCountry(selectedResource.id, country);

//     if (isCorrect && canPlace) {
//       const placementKey = `${selectedResource.id}_${Date.now()}`;

//       setPlacedResources((prev) => ({
//         ...prev,
//         [placementKey]: country,
//       }));

//       const newPlacedCount = getResourcePlacementCount(selectedResource.id) + 1;
//       const resource = selectedResource;

//       if (newPlacedCount < resource.maxCountries) {
//         setFeedback(
//           `✅ صحيح! ${resource.name} موجود في ${countryNames[country]} (${newPlacedCount}/${resource.maxCountries})`
//         );
//       } else {
//         setFeedback(
//           `✅ ممتاز! أكملت وضع ${resource.name} في جميع الدول الصحيحة`
//         );
//         setSelectedResource(null);
//       }
//     } else {
//       wrongAnswerSound();
//       if (!isCorrect) {
//         setFeedback(
//           `❌ خطأ! ${selectedResource.name} غير موجود في ${countryNames[country]}`
//         );
//       } else {
//         setFeedback(`❌ لقد وضعت ${selectedResource.name} بالفعل في دولتين`);
//       }
//     }
//   };

//   const getCountryColor = (country) => {
//     const hasResource = Object.values(placedResources).includes(country);
//     return hasResource ? "#4CAF50" : "#ddd";
//   };

//   const getResourcesForCountry = (country) => {
//     return Object.entries(placedResources)
//       .filter(([_, placedCountry]) => placedCountry === country)
//       .map(([resourceKey]) => {
//         const resourceId = resourceKey.split("_")[0];
//         return resources.find((r) => r.id === resourceId);
//       })
//       .filter(Boolean);
//   };

//   const resetGame = () => {
//     setPlacedResources({});
//     setSelectedResource(null);
//     setFeedback("اختر مورداً من الأسفل ثم انقر على الدولة الصحيحة");
//     setIsCompleted(false);
//   };

//   // Check if a resource is fully placed
//   const isResourceFullyPlaced = (resourceId) => {
//     const resource = resources.find((r) => r.id === resourceId);
//     const placedCount = getResourcePlacementCount(resourceId);
//     return placedCount >= resource.maxCountries;
//   };

//   return (
//     <ScrollView style={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.title}>موارد المغرب العربي</Text>
//         <Text style={styles.subtitle}>
//           منطقة المغرب العربي غنية بالموارد. بعض الموارد موجودة في أكثر من دولة.
//         </Text>

//         <View style={[styles.feedbackBox, isCompleted && styles.successBox]}>
//           <Text style={styles.feedbackText}>{feedback}</Text>
//         </View>

//         <View style={styles.mapContainer}>
//           {/* BIGGER SVG - Changed viewBox to zoom in on the countries */}
//           <Svg width="100%" height={350} viewBox="850 200 350 300">
//             <G>
//               {/* TUNISIA */}
//               <Path
//                 d="M1048.2 289.1l-0.1 4.9-2.6 1.8-1.6 2.1-3.6 2.5 0.6 2.6-0.4 2.8-2.6 1.4-2.6-11.5-3.4-2.6-0.1-1.5-4.5-3.9-0.6-4.8 3.2-3.6 1.1-5.3-1-6.1 1-3.3 5.7-2.5 3.7 0.7 0 3.3 4.4-2.4 0.4 1.2-2.5 3.2 0.1 2.9 1.9 1.6-0.5 5.6-3.5 3.2 1.2 3.5 2.8 0.1 1.4 3.1 2.1 1z"
//                 fill={getCountryColor("TUNISIA")}
//                 stroke="#333"
//                 strokeWidth="2"
//                 onPress={() => onCountryPress("TUNISIA")}
//               />

//               {/* LIBYA */}
//               <Path
//                 d="M1122.6 299.1l-1.7 3.1 1 2.8-1.1 3.9 2 5.2 1.3 22.8 1 23.7 0.5 12.8-6.4 0 0 2.7-22.6-12.3-22.5-12.3-5.5 3.5-3.8 2.4-3.2-3.5-8.8-2.8-2.5-4-4.5-3-2.5 1.2-2.1-3.6-0.2-2.7-3.4-4.7 2.2-2.7-0.6-4 0.6-3.5-0.4-3 0.8-5.2-0.4-3-1.9-5.7 2.6-1.4 0.4-2.8-0.6-2.6 3.6-2.5 1.6-2.1 2.6-1.8 0.1-4.9 6.4 2.2 2.3-0.6 4.5 1.1 7.3 2.9 2.8 5.7 4.9 1.2 7.8 2.7 6 3.2 2.5-1.7 2.5-2.9-1.6-4.9 1.5-3.2 3.7-3 3.7-0.8 7.4 1.3 2 2.8 2 0.1 1.8 1.1 5.4 0.7 1.5 2.1z"
//                 fill={getCountryColor("LIBYA")}
//                 stroke="#333"
//                 strokeWidth="2"
//                 onPress={() => onCountryPress("LIBYA")}
//               />

//               {/* ALGERIA */}
//               <Path
//                 d="M1031 264.6l-1 3.3 1 6.1-1.1 5.3-3.2 3.6 0.6 4.8 4.5 3.9 0.1 1.5 3.4 2.6 2.6 11.5 1.9 5.7 0.4 3-0.8 5.2 0.4 3-0.6 3.5 0.6 4-2.2 2.7 3.4 4.7 0.2 2.7 2.1 3.6 2.5-1.2 4.5 3 2.5 4-18.8 12.3-16 12.6-7.8 2.8-6.2 0.7-0.1-4.1-2.6-1.1-3.5-1.8-1.3-3-18.7-14-18.6-14-20.5-15.6 0.1-1.2 0.1-0.4 0.1-7.6 8.9-4.8 5.4-1 4.5-1.7 2.1-3.2 6.4-2.5 0.3-4.8 3.1-0.6 2.5-2.3 7.1-1.1 1-2.5-1.4-1.4-1.9-6.8-0.3-3.9-1.9-4.1 5.1-3.5 5.8-1.1 3.3-2.6 5.1-2 9-1.1 8.8-0.5 2.7 0.9 4.9-2.5 5.7-0.1 2.2 1.5 3.6-0.4z"
//                 fill={getCountryColor("ALGERIA")}
//                 stroke="#333"
//                 strokeWidth="2"
//                 onPress={() => onCountryPress("ALGERIA")}
//               />

//               {/* MOROCCO */}
//               <Path
//                 d="M974.8 276l1.9 4.1 0.3 3.9 1.9 6.8 1.4 1.4-1 2.5-7.1 1.1-2.5 2.3-3.1 0.6-0.3 4.8-6.4 2.5-2.1 3.2-4.5 1.7-5.4 1-8.9 4.8-0.1 7.6-0.9 0 0.1 3.4-3.4 0.2-1.8 1.5-2.5 0-2-0.9-4.6 0.7-1.9 5-1.8 0.5-2.7 8.1-7.9 6.9-2 8.9-2.4 2.9-0.7 2.3-12.5 0.5-0.1 0 0.3-3 2.2-1.7 1.9-3.4-0.3-2.2 2-4.5 3.2-4.1 1.9-1 1.6-3.7 0.2-3.5 2.1-3.9 3.8-2.4 3.6-6.5 0.1-0.1 2.9-2.5 5.1-0.7 4.4-4.4 2.8-1.7 4.7-5.4-1.2-7.9 2.2-5.6 0.9-3.4 3.6-4.3 5.4-2.9 4.1-2.7 3.7-6.6 1.8-4 3.9 0.1 3.1 2.7 5.1-0.4 5.5 1.4 2.4 0z"
//                 fill={getCountryColor("MOROCCO")}
//                 stroke="#333"
//                 strokeWidth="2"
//                 onPress={() => onCountryPress("MOROCCO")}
//               />

//               {/* MAURITANIA */}
//               <Path
//                 d="M959.2 341.5l-8.5 0.1 2.4 27.7 2.5 27.7 1 0.8-1.3 4.5-22.5 0.1-0.9 1.4-2.1-0.4-3.2 1.3-3.9-1.8-1.8 0.1-1 3.8-1.9 1.2-3.6-4.4-3.4-4.8-3.6-1.7-2.7-1.8-3.1 0-2.8 1.4-2.7-0.5-2 2-0.4-3.4 1.6-3.2 0.8-6-0.4-6.4-0.6-3.2 0.6-3.2-1.4-3-2.8-2.8 1.3-2.1 21.7 0-0.9-9.3 1.5-3.3 5.2-0.5 0.2-16.5 18 0.4 0.2-9.8 20.5 15.6z"
//                 fill={getCountryColor("MAURITANIA")}
//                 stroke="#333"
//                 strokeWidth="2"
//                 onPress={() => onCountryPress("MAURITANIA")}
//               />

//               {/* Resource icons on map */}
//               {Object.entries(placedResources).map(([resourceKey, country]) => {
//                 const resourceId = resourceKey.split("_")[0];
//                 const resource = resources.find((r) => r.id === resourceId);
//                 if (!resource) return null;

//                 const countryResources = getResourcesForCountry(country);
//                 const index = countryResources.findIndex(
//                   (r) => r.id === resourceId
//                 );
//                 const pos = countryPositions[country];
//                 const x = pos.x + (index % 3) * 18;
//                 const y = pos.y + Math.floor(index / 3) * 25;

//                 return (
//                   <SvgText
//                     key={resourceKey}
//                     x={x}
//                     y={y}
//                     fontSize="18"
//                     textAnchor="middle"
//                     fill="#333"
//                   >
//                     {resource.icon}
//                   </SvgText>
//                 );
//               })}
//             </G>
//           </Svg>
//         </View>

//         {/* Resources Selection - NEW LAYOUT: 2 per row */}
//         <View style={styles.resourcesSection}>
//           <Text style={styles.sectionTitle}>اختر المورد:</Text>
//           <View style={styles.resourcesGrid}>
//             {resources.map((resource) => {
//               const isFullyPlaced = isResourceFullyPlaced(resource.id);
//               const isSelected = selectedResource?.id === resource.id;
//               const placedCount = getResourcePlacementCount(resource.id);

//               return (
//                 <TouchableOpacity
//                   key={resource.id}
//                   style={[
//                     styles.resourceCard,
//                     isSelected && styles.selectedResource,
//                     isFullyPlaced && styles.placedResource,
//                   ]}
//                   onPress={() => handleResourceSelect(resource)}
//                   disabled={isFullyPlaced}
//                   activeOpacity={isFullyPlaced ? 1 : 0.7}
//                 >
//                   <Text style={styles.resourceIcon}>{resource.icon}</Text>
//                   <Text style={styles.resourceName}>{resource.name}</Text>
//                   <Text style={styles.resourceCounter}>
//                     ({placedCount}/{resource.maxCountries})
//                   </Text>
//                   {isFullyPlaced && <Text style={styles.checkMark}>✓</Text>}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         {isCompleted && (
//           <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
//             <Text style={styles.resetButtonText}>🔄 العب مرة أخرى</Text>
//           </TouchableOpacity>
//         )}

//         <View style={styles.instructions}>
//           <Text style={styles.instructionsTitle}>📋 التعليمات:</Text>
//           <Text style={styles.instructionsText}>
//             1. اختر مورداً من القائمة أدناه{"\n"}
//             2. انقر على الدولة الصحيحة على الخريطة{"\n"}
//             3. يمكن وضع بعض الموارد في دولتين{"\n"}
//             4. استمر حتى تضع جميع الموارد بشكل صحيح{"\n"}
//             5. الأرقام (1/2) تعني وضعت 1 من أصل 2
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   container: {
//     padding: 15,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 20,
//     textAlign: "center",
//     lineHeight: 24,
//     paddingHorizontal: 10,
//   },
//   feedbackBox: {
//     backgroundColor: "#e3f2fd",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 20,
//     width: "100%",
//     borderWidth: 2,
//     borderColor: "#2196F3",
//   },
//   successBox: {
//     backgroundColor: "#e8f5e9",
//     borderColor: "#4CAF50",
//   },
//   feedbackText: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#333",
//     fontWeight: "600",
//   },
//   mapContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 10,
//     marginBottom: 20,
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     minHeight: 370,
//   },
//   resourcesSection: {
//     width: "100%",
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 15,
//     textAlign: "center",
//     color: "#333",
//   },
//   resourcesGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   resourceCard: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 10,
//     width: "48%",
//     minHeight: 110,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#ddd",
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     position: "relative",
//   },
//   selectedResource: {
//     borderColor: "#2196F3",
//     backgroundColor: "#e3f2fd",
//     transform: [{ scale: 1.03 }],
//   },
//   placedResource: {
//     opacity: 0.7,
//     borderColor: "#4CAF50",
//     backgroundColor: "#e8f5e9",
//   },
//   resourceIcon: {
//     fontSize: 32,
//     marginBottom: 6,
//   },
//   resourceName: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#333",
//     marginBottom: 4,
//     fontWeight: "600",
//   },
//   resourceCounter: {
//     fontSize: 13,
//     color: "#666",
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   checkMark: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     fontSize: 20,
//     color: "#4CAF50",
//   },
//   resetButton: {
//     backgroundColor: "#4CAF50",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 10,
//     minWidth: 200,
//   },
//   resetButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   instructions: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   instructionsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   instructionsText: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 22,
//   },
// });

// export default Hardtwo;
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import useSound from "../../../../../hooks/useSound";

const Hardtwo = () => {
  const { winSound, wrongAnswerSound } = useSound();
  const [selectedResource, setSelectedResource] = useState(null);
  const [placedResources, setPlacedResources] = useState({});
  const [feedback, setFeedback] = useState(
    "اختر مورداً من الأسفل ثم انقر على الدولة الصحيحة"
  );
  const [isCompleted, setIsCompleted] = useState(false);

  // Updated resources - each resource can be placed in multiple countries
  const resources = [
    {
      id: "oil",
      name: "النفط",
      icon: "🛢️",
      countries: ["LIBYA", "ALGERIA"],
      maxCountries: 2,
    },
    {
      id: "gas",
      name: "الغاز الطبيعي",
      icon: "🔥",
      countries: ["ALGERIA", "LIBYA"],
      maxCountries: 2,
    },
    {
      id: "phosphate",
      name: "الفوسفات",
      icon: "⚗️",
      countries: ["MOROCCO", "TUNISIA"],
      maxCountries: 2,
    },
    {
      id: "fish",
      name: "الأسماك",
      icon: "🐟",
      countries: ["MAURITANIA", "MOROCCO"],
      maxCountries: 2,
    },
    {
      id: "solar",
      name: "الطاقة الشمسية",
      icon: "☀️",
      countries: ["ALGERIA", "MOROCCO"],
      maxCountries: 2,
    },
  ];

  const countryNames = {
    MOROCCO: "المغرب",
    ALGERIA: "الجزائر",
    TUNISIA: "تونس",
    LIBYA: "ليبيا",
    MAURITANIA: "موريتانيا",
  };

  // Updated positions for larger map
  const countryPositions = {
    MOROCCO: { x: 950, y: 295 },
    ALGERIA: { x: 1000, y: 315 },
    TUNISIA: { x: 1040, y: 290 },
    LIBYA: { x: 1090, y: 325 },
    MAURITANIA: { x: 930, y: 375 },
  };

  // FIXED: Calculate how many times a resource has been placed
  const getResourcePlacementCount = (resourceId) => {
    return Object.keys(placedResources).filter((key) =>
      key.startsWith(`${resourceId}_`)
    ).length;
  };

  // Check if a resource can be placed in a specific country
  const canPlaceResourceInCountry = (resourceId, country) => {
    const resource = resources.find((r) => r.id === resourceId);
    if (!resource || !resource.countries.includes(country)) return false;

    const placedCount = getResourcePlacementCount(resourceId);
    return placedCount < resource.maxCountries;
  };

  // Check if resource is already placed in this specific country
  const isResourcePlacedInCountry = (resourceId, country) => {
    return Object.entries(placedResources).some(
      ([key, value]) => key.startsWith(`${resourceId}_`) && value === country
    );
  };

  useEffect(() => {
    const allResourcesPlaced = resources.every((resource) => {
      const placedCount = getResourcePlacementCount(resource.id);
      return placedCount === resource.maxCountries;
    });

    if (allResourcesPlaced) {
      winSound();
      setIsCompleted(true);
      setFeedback("🎉 ممتاز! لقد وضعت جميع الموارد في الأماكن الصحيحة!");
    }
  }, [placedResources]);

  const handleResourceSelect = (resource) => {
    const placedCount = getResourcePlacementCount(resource.id);
    if (placedCount >= resource.maxCountries) return;

    setSelectedResource(resource);
    setFeedback(
      `اختر الدولة الصحيحة لـ ${resource.name} (${placedCount}/${resource.maxCountries})`
    );
  };

  const onCountryPress = (country) => {
    if (!selectedResource) {
      setFeedback("⚠️ الرجاء اختيار مورد من الأسفل أولاً");
      return;
    }

    if (isResourcePlacedInCountry(selectedResource.id, country)) {
      setFeedback(`⚠️ هذا المورد موجود بالفعل في ${countryNames[country]}`);
      return;
    }

    const isCorrect = selectedResource.countries.includes(country);
    const canPlace = canPlaceResourceInCountry(selectedResource.id, country);

    if (isCorrect && canPlace) {
      const placementKey = `${selectedResource.id}_${Date.now()}`;

      setPlacedResources((prev) => ({
        ...prev,
        [placementKey]: country,
      }));

      const newPlacedCount = getResourcePlacementCount(selectedResource.id) + 1;
      const resource = selectedResource;

      if (newPlacedCount < resource.maxCountries) {
        setFeedback(
          `✅ صحيح! ${resource.name} موجود في ${countryNames[country]} (${newPlacedCount}/${resource.maxCountries})`
        );
      } else {
        setFeedback(
          `✅ ممتاز! أكملت وضع ${resource.name} في جميع الدول الصحيحة`
        );
        setSelectedResource(null);
      }
    } else {
      wrongAnswerSound();
      if (!isCorrect) {
        setFeedback(
          `❌ خطأ! ${selectedResource.name} غير موجود في ${countryNames[country]}`
        );
      } else {
        setFeedback(`❌ لقد وضعت ${selectedResource.name} بالفعل في دولتين`);
      }
    }
  };

  const getCountryColor = (country) => {
    const hasResource = Object.values(placedResources).includes(country);
    return hasResource ? "#4CAF50" : "#ddd";
  };

  const getResourcesForCountry = (country) => {
    return Object.entries(placedResources)
      .filter(([_, placedCountry]) => placedCountry === country)
      .map(([resourceKey]) => {
        const resourceId = resourceKey.split("_")[0];
        return resources.find((r) => r.id === resourceId);
      })
      .filter(Boolean);
  };

  const resetGame = () => {
    setPlacedResources({});
    setSelectedResource(null);
    setFeedback("اختر مورداً من الأسفل ثم انقر على الدولة الصحيحة");
    setIsCompleted(false);
  };

  // Check if a resource is fully placed
  const isResourceFullyPlaced = (resourceId) => {
    const resource = resources.find((r) => r.id === resourceId);
    const placedCount = getResourcePlacementCount(resourceId);
    return placedCount >= resource.maxCountries;
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>موارد المغرب العربي</Text>
        <Text style={styles.subtitle}>
          منطقة المغرب العربي غنية بالموارد. بعض الموارد موجودة في أكثر من دولة.
        </Text>

        <View style={[styles.feedbackBox, isCompleted && styles.successBox]}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>

        <View style={styles.mapContainer}>
          {/* MUCH BIGGER MAP - Zoomed in significantly on the countries */}
          <Svg width="100%" height={280} viewBox="880 220 280 240">
            <G>
              {/* TUNISIA */}
              <Path
                d="M1048.2 289.1l-0.1 4.9-2.6 1.8-1.6 2.1-3.6 2.5 0.6 2.6-0.4 2.8-2.6 1.4-2.6-11.5-3.4-2.6-0.1-1.5-4.5-3.9-0.6-4.8 3.2-3.6 1.1-5.3-1-6.1 1-3.3 5.7-2.5 3.7 0.7 0 3.3 4.4-2.4 0.4 1.2-2.5 3.2 0.1 2.9 1.9 1.6-0.5 5.6-3.5 3.2 1.2 3.5 2.8 0.1 1.4 3.1 2.1 1z"
                fill={getCountryColor("TUNISIA")}
                stroke="#333"
                strokeWidth="2"
                onPress={() => onCountryPress("TUNISIA")}
              />

              {/* LIBYA */}
              <Path
                d="M1122.6 299.1l-1.7 3.1 1 2.8-1.1 3.9 2 5.2 1.3 22.8 1 23.7 0.5 12.8-6.4 0 0 2.7-22.6-12.3-22.5-12.3-5.5 3.5-3.8 2.4-3.2-3.5-8.8-2.8-2.5-4-4.5-3-2.5 1.2-2.1-3.6-0.2-2.7-3.4-4.7 2.2-2.7-0.6-4 0.6-3.5-0.4-3 0.8-5.2-0.4-3-1.9-5.7 2.6-1.4 0.4-2.8-0.6-2.6 3.6-2.5 1.6-2.1 2.6-1.8 0.1-4.9 6.4 2.2 2.3-0.6 4.5 1.1 7.3 2.9 2.8 5.7 4.9 1.2 7.8 2.7 6 3.2 2.5-1.7 2.5-2.9-1.6-4.9 1.5-3.2 3.7-3 3.7-0.8 7.4 1.3 2 2.8 2 0.1 1.8 1.1 5.4 0.7 1.5 2.1z"
                fill={getCountryColor("LIBYA")}
                stroke="#333"
                strokeWidth="2"
                onPress={() => onCountryPress("LIBYA")}
              />

              {/* ALGERIA */}
              <Path
                d="M1031 264.6l-1 3.3 1 6.1-1.1 5.3-3.2 3.6 0.6 4.8 4.5 3.9 0.1 1.5 3.4 2.6 2.6 11.5 1.9 5.7 0.4 3-0.8 5.2 0.4 3-0.6 3.5 0.6 4-2.2 2.7 3.4 4.7 0.2 2.7 2.1 3.6 2.5-1.2 4.5 3 2.5 4-18.8 12.3-16 12.6-7.8 2.8-6.2 0.7-0.1-4.1-2.6-1.1-3.5-1.8-1.3-3-18.7-14-18.6-14-20.5-15.6 0.1-1.2 0.1-0.4 0.1-7.6 8.9-4.8 5.4-1 4.5-1.7 2.1-3.2 6.4-2.5 0.3-4.8 3.1-0.6 2.5-2.3 7.1-1.1 1-2.5-1.4-1.4-1.9-6.8-0.3-3.9-1.9-4.1 5.1-3.5 5.8-1.1 3.3-2.6 5.1-2 9-1.1 8.8-0.5 2.7 0.9 4.9-2.5 5.7-0.1 2.2 1.5 3.6-0.4z"
                fill={getCountryColor("ALGERIA")}
                stroke="#333"
                strokeWidth="2"
                onPress={() => onCountryPress("ALGERIA")}
              />

              {/* MOROCCO */}
              <Path
                d="M974.8 276l1.9 4.1 0.3 3.9 1.9 6.8 1.4 1.4-1 2.5-7.1 1.1-2.5 2.3-3.1 0.6-0.3 4.8-6.4 2.5-2.1 3.2-4.5 1.7-5.4 1-8.9 4.8-0.1 7.6-0.9 0 0.1 3.4-3.4 0.2-1.8 1.5-2.5 0-2-0.9-4.6 0.7-1.9 5-1.8 0.5-2.7 8.1-7.9 6.9-2 8.9-2.4 2.9-0.7 2.3-12.5 0.5-0.1 0 0.3-3 2.2-1.7 1.9-3.4-0.3-2.2 2-4.5 3.2-4.1 1.9-1 1.6-3.7 0.2-3.5 2.1-3.9 3.8-2.4 3.6-6.5 0.1-0.1 2.9-2.5 5.1-0.7 4.4-4.4 2.8-1.7 4.7-5.4-1.2-7.9 2.2-5.6 0.9-3.4 3.6-4.3 5.4-2.9 4.1-2.7 3.7-6.6 1.8-4 3.9 0.1 3.1 2.7 5.1-0.4 5.5 1.4 2.4 0z"
                fill={getCountryColor("MOROCCO")}
                stroke="#333"
                strokeWidth="2"
                onPress={() => onCountryPress("MOROCCO")}
              />

              {/* MAURITANIA */}
              <Path
                d="M959.2 341.5l-8.5 0.1 2.4 27.7 2.5 27.7 1 0.8-1.3 4.5-22.5 0.1-0.9 1.4-2.1-0.4-3.2 1.3-3.9-1.8-1.8 0.1-1 3.8-1.9 1.2-3.6-4.4-3.4-4.8-3.6-1.7-2.7-1.8-3.1 0-2.8 1.4-2.7-0.5-2 2-0.4-3.4 1.6-3.2 0.8-6-0.4-6.4-0.6-3.2 0.6-3.2-1.4-3-2.8-2.8 1.3-2.1 21.7 0-0.9-9.3 1.5-3.3 5.2-0.5 0.2-16.5 18 0.4 0.2-9.8 20.5 15.6z"
                fill={getCountryColor("MAURITANIA")}
                stroke="#333"
                strokeWidth="2"
                onPress={() => onCountryPress("MAURITANIA")}
              />

              {/* Resource icons on map */}
              {Object.entries(placedResources).map(([resourceKey, country]) => {
                const resourceId = resourceKey.split("_")[0];
                const resource = resources.find((r) => r.id === resourceId);
                if (!resource) return null;

                const countryResources = getResourcesForCountry(country);
                const index = countryResources.findIndex(
                  (r) => r.id === resourceId
                );
                const pos = countryPositions[country];
                const x = pos.x + (index % 3) * 18;
                const y = pos.y + Math.floor(index / 3) * 25;

                return (
                  <SvgText
                    key={resourceKey}
                    x={x}
                    y={y}
                    fontSize="18"
                    textAnchor="middle"
                    fill="#333"
                  >
                    {resource.icon}
                  </SvgText>
                );
              })}
            </G>
          </Svg>
        </View>

        {/* Resources Selection - NEW LAYOUT: 2 per row */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>اختر المورد:</Text>
          <View style={styles.resourcesGrid}>
            {resources.map((resource) => {
              const isFullyPlaced = isResourceFullyPlaced(resource.id);
              const isSelected = selectedResource?.id === resource.id;
              const placedCount = getResourcePlacementCount(resource.id);

              return (
                <TouchableOpacity
                  key={resource.id}
                  style={[
                    styles.resourceCard,
                    isSelected && styles.selectedResource,
                    isFullyPlaced && styles.placedResource,
                  ]}
                  onPress={() => handleResourceSelect(resource)}
                  disabled={isFullyPlaced}
                  activeOpacity={isFullyPlaced ? 1 : 0.7}
                >
                  <Text style={styles.resourceIcon}>{resource.icon}</Text>
                  <Text style={styles.resourceName}>{resource.name}</Text>
                  <Text style={styles.resourceCounter}>
                    ({placedCount}/{resource.maxCountries})
                  </Text>
                  {isFullyPlaced && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isCompleted && (
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>🔄 العب مرة أخرى</Text>
          </TouchableOpacity>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>📋 التعليمات:</Text>
          <Text style={styles.instructionsText}>
            1. اختر مورداً من القائمة أدناه{"\n"}
            2. انقر على الدولة الصحيحة على الخريطة{"\n"}
            3. يمكن وضع بعض الموارد في دولتين{"\n"}
            4. استمر حتى تضع جميع الموارد بشكل صحيح{"\n"}
            5. الأرقام (1/2) تعني وضعت 1 من أصل 2
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  feedbackBox: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  successBox: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4CAF50",
  },
  feedbackText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  mapContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 290,
  },
  resourcesSection: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  resourcesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  resourceCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  selectedResource: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
    transform: [{ scale: 1.03 }],
  },
  placedResource: {
    opacity: 0.7,
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e9",
  },
  resourceIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  resourceName: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    marginBottom: 4,
    fontWeight: "600",
  },
  resourceCounter: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  checkMark: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 20,
    color: "#4CAF50",
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    minWidth: 200,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  instructions: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});

export default Hardtwo;