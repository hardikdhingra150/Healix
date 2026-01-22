// Health status calculations and validations

export const calculateBMI = (weight, height) => {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };
  
  export const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  export const getBloodPressureStatus = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return 'Normal';
    if (systolic < 130 && diastolic < 80) return 'Elevated';
    if (systolic < 140 || diastolic < 90) return 'High Stage 1';
    return 'High Stage 2';
  };
  
  export const getHeartRateStatus = (heartRate) => {
    if (heartRate < 60) return 'Low';
    if (heartRate <= 100) return 'Normal';
    return 'High';
  };
  
  export const getOxygenStatus = (oxygenLevel) => {
    if (oxygenLevel >= 95) return 'Normal';
    if (oxygenLevel >= 90) return 'Low';
    return 'Critical';
  };
  
  export const getTemperatureStatus = (temperature) => {
    if (temperature < 36.1) return 'Low';
    if (temperature <= 37.2) return 'Normal';
    if (temperature <= 38) return 'Elevated';
    return 'High';
  };
  
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };