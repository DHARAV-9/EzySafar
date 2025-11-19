export interface FareOption {
  name: string;
  perKm: number;
  baseFare: number;
}

export interface FareResult {
  type: string;
  fare: string;
  breakdown: {
    baseFare: number;
    distanceCost: number;
  };
}

export interface FareCalculationResult {
  allFares: FareResult[];
  cheapest: FareResult;
}

export const fareOptions = {
  olaAuto: { name: "Ola Auto", perKm: 18, baseFare: 11 },
  olaMini: { name: "Ola Mini", perKm: 25, baseFare: 35 },
  olaPrime: { name: "Ola Prime", perKm: 28, baseFare: 45 },
  uberAuto: { name: "Uber Auto", perKm: 14, baseFare: 10 },
  uberGo: { name: "Uber Go", perKm: 22, baseFare: 32 },
  uberPremier: { name: "Uber Premier", perKm: 30, baseFare: 42 }
};

export const calculateFares = (distanceKm: number): FareCalculationResult => {
  const results: FareResult[] = [];
  
  Object.entries(fareOptions).forEach(([key, option]) => {
    const distanceCost = distanceKm * option.perKm;
    const totalFare = option.baseFare + distanceCost;
    
    results.push({
      type: option.name,
      fare: totalFare.toFixed(2),
      breakdown: {
        baseFare: option.baseFare,
        distanceCost: parseFloat(distanceCost.toFixed(2))
      }
    });
  });

  results.sort((a, b) => parseFloat(a.fare) - parseFloat(b.fare));
  
  return {
    allFares: results,
    cheapest: results[0]
  };
};