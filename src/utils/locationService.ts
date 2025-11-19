import axios from 'axios';

interface Coordinates {
  lat: number;
  lng: number;
}

export const getDistance = async (start: Coordinates, end: Coordinates): Promise<number> => {
  try {
    const OPENROUTE_API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;
    
    const response = await axios.get(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        params: {
          start: `${start.lng},${start.lat}`,
          end: `${end.lng},${end.lat}`,
        },
        headers: {
          'Authorization': OPENROUTE_API_KEY,
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        }
      }
    );

    const distanceInKm = response.data.features[0].properties.segments[0].distance / 1000;
    return parseFloat(distanceInKm.toFixed(2));
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw new Error('Failed to calculate route distance. Please try again.');
  }
}