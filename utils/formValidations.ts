export const checkForValidPassword = (value: string) =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(value);

export const checkIfSpecialCharacters = (value: string) => {
  const regex = /^[A-Za-z\s/,.'-]+$/;
  return regex.test(value);
};

export const checkForCorrectPhoneNumber = (value: string) =>
  /^(?:\+?[1-9]\d{0,3})?(?:0\d{10}|\d{6,14})$/.test(value);
