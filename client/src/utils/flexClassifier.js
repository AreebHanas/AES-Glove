// Flex classification utility

export const classifyFlexValue01 = (value) => {
  if (value < 25) return "No Bend";
  if (value < 50) return "Almost No Bend";
  if (value < 75) return "Almost Full Bend";
  return "Full Bend";
};
export const classifyFlexValue02 = (value) => {
  if (value < 20) return "No Bend";
  if (value < 50) return  "Almost No Bend";
  if (value < 70) return "Almost Full Bend";
  return "Full Bend";
};
export const classifyFlexValue03 = (value) => {
  if (value < 35) return "No Bend";
  if (value < 70) return  "Almost No Bend";
  if (value < 85) return "Almost Full Bend";
  return "Full Bend";
};
export const classifyFlexValue04 = (value) => {
  if (value < 40) return "No Bend";
  if (value < 70) return  "Almost No Bend";
  if (value < 90) return "Almost Full Bend";
  return "Full Bend";
};
export const classifyFlexValue05 = (value) => {
  if (value < 30) return "No Bend";
  if (value < 60) return  "Almost No Bend";
  if (value < 85) return "Almost Full Bend";
  return "Full Bend";
};
export const classifyFlexValue06 = (value) => {
  if (value < 35) return "No Bend";
  if (value < 65) return  "Almost No Bend";
  if (value < 90) return "Almost Full Bend";
  return "Full Bend";
};
export const classifyFlexValue07 = (value) => {
  if (value < 40) return "No Bend";
  if (value < 70) return  "Almost No Bend";
  if (value < 95) return "Almost Full Bend";
  return "Full Bend";
};
