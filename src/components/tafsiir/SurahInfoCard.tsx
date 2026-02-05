import React from "react";
import CollapsibleSurahGrid from "./CollapsibleSurahGrid";

interface SurahInfoCardProps {
  surahName?: string;
  data?: {
    nameMeaning: string;
    revelationType: string;
    revelationContext: string;
    mainTheme: string;
  };
}

const SurahInfoCard: React.FC<SurahInfoCardProps> = ({ surahName, data }) => {
  // Default Data for "Al-Faatixa" if generic fallback needed (Backward Compatibility for Index.tsx)
  const defaultData = {
    nameMeaning: "Al-Faatixa waxay ka timid erayga Carabiga ah 'Al-Fath' oo macnaheedu yahay furitaan. Waxaa loogu magac daray 'Furitaanka Kitaabka' sababtoo ah waa suuradda lagu bilaabo akhriska Quraanka Kariimka ah iyo salaadda.",
    revelationType: "Waa Makki, waxaana la soo dejiyey xilli ay Muslimiintu joogeen Maka ka hor Hijradii Madiina.",
    revelationContext: "Suuraddan waxaa loo soo dejiyey inay noqoto gundhigga xiriirka ka dhexeeya addoonka iyo Rabbigiis, iyadoo baraysa qofka mu'minka ah qaabka saxda ah ee loo baryo loona weyneeyo Allah.",
    mainTheme: "Mawduuca ugu weyn ee suuradda waa qirashada kelinimada Allah (Tawxiidka), u hoggaansanaanta caabuditaankiisa, iyo weydiisashada hanuunka jidka toosan."
  };

  const displayData = data || defaultData;

  return <CollapsibleSurahGrid data={displayData} />;
};

export default SurahInfoCard;
