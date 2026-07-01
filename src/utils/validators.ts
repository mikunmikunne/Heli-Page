export const isValidPhoneNumber = (phone: string): boolean => {
  const hasValidChars = /^[\d\s\-\+\(\)\.]{10,20}$/.test(phone);
  const digitCount = phone.replace(/\D/g, '').length;
  return hasValidChars && digitCount >= 10;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

