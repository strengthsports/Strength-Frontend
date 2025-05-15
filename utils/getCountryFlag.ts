import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const getCountryCode = (countryName: string) => {
  if (!countryName) return null;
  
  const cleanName = countryName
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

  const specialCases: Record<string, string> = {
    "USA": "US",
    "UNITED STATES": "US",
    "UNITED STATES OF AMERICA": "US",
    "UK": "GB",
    "UNITED KINGDOM": "GB",
    "UAE": "AE",
    "RUSSIA": "RU",
    "SOUTH KOREA": "KR",
    "NORTH KOREA": "KP",
    "PHILIPPINES": "PH",
  };

  return specialCases[cleanName] || countries.getAlpha2Code(cleanName, "en");
};

export const getCountryFlag = (countryName: string) => {
  const countryCode = getCountryCode(countryName);
  if (!countryCode) return null;
  
  return `https://flagsapi.com/${countryCode}/flat/64.png`;
};