import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);


 const office = {
  latitude: Number(process.env.EXPO_PUBLIC_OFFICE_LAT),
  longitude: Number(process.env.EXPO_PUBLIC_OFFICE_LONG),
  radius: Number(process.env.EXPO_PUBLIC_RADIUS),
};


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Debes otorgar permisos de ubicación");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  const userLat = location?.latitude;
  const userLng = location?.longitude;

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: userLat,
        longitude: userLng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
    >
      
      <Marker
        coordinate={office}
        title="Lugar de fichaje"
        description="Debés estar dentro del círculo para marcar entrada/salida"
        pinColor="red"
      />

   
      <Circle
        center={office}
        radius={office.radius}
        strokeColor="rgba(0,122,255,0.6)"
        fillColor="rgba(0,122,255,0.2)"
      />

      
      <Marker
        coordinate={{ latitude: userLat, longitude: userLng }}
        title="Mi ubicación"
        pinColor="blue"
      />
    </MapView>
  );
}
