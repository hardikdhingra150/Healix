export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateVitals = (vitals) => {
    const errors = {};
  
    if (vitals.systolic && (vitals.systolic < 70 || vitals.systolic > 200)) {
      errors.systolic = 'Systolic pressure should be between 70-200';
    }
  
    if (vitals.diastolic && (vitals.diastolic < 40 || vitals.diastolic > 130)) {
      errors.diastolic = 'Diastolic pressure should be between 40-130';
    }
  
    if (vitals.heartRate && (vitals.heartRate < 30 || vitals.heartRate > 200)) {
      errors.heartRate = 'Heart rate should be between 30-200';
    }
  
    if (vitals.temperature && (vitals.temperature < 35 || vitals.temperature > 42)) {
      errors.temperature = 'Temperature should be between 35-42°C';
    }
  
    if (vitals.oxygenLevel && (vitals.oxygenLevel < 70 || vitals.oxygenLevel > 100)) {
      errors.oxygenLevel = 'Oxygen level should be between 70-100%';
    }
  
    if (vitals.weight && (vitals.weight < 20 || vitals.weight > 300)) {
      errors.weight = 'Weight should be between 20-300 kg';
    }
  
    return errors;
  };