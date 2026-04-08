export interface District {
  id: string;
  name: string;
  description: string;
  kanaGroup: string[];
  order: number;
}

export const HIRAGANA_DISTRICTS: District[] = [
  { id: 'district_1', name: 'Vowel Village', description: 'The humble beginnings.', kanaGroup: ['a', 'i', 'u', 'e', 'o'], order: 1 },
  { id: 'district_2', name: 'Ka-Ki Crossroads', description: 'The sturdy consonants.', kanaGroup: ['ka', 'ki', 'ku', 'ke', 'ko'], order: 2 },
  { id: 'district_3', name: 'Sa-Shi Streets', description: 'The whispering winds.', kanaGroup: ['sa', 'shi', 'su', 'se', 'so'], order: 3 },
  { id: 'district_4', name: 'Ta-Chi Town', description: 'The rhythmic steps.', kanaGroup: ['ta', 'chi', 'tsu', 'te', 'to'], order: 4 },
  { id: 'district_5', name: 'Na-Ni Neighborhood', description: 'The gentle river.', kanaGroup: ['na', 'ni', 'nu', 'ne', 'no'], order: 5 },
  { id: 'district_6', name: 'Ha-Hi Heights', description: 'The high peaks.', kanaGroup: ['ha', 'hi', 'fu', 'he', 'ho'], order: 6 },
  { id: 'district_7', name: 'Ma-Mi Markets', description: 'The bustling bazaar.', kanaGroup: ['ma', 'mi', 'mu', 'me', 'mo'], order: 7 },
  { id: 'district_8', name: 'Ya-Yu Yard', description: 'The winding paths.', kanaGroup: ['ya', 'yu', 'yo'], order: 8 },
  { id: 'district_9', name: 'Ra-Ri Ridge', description: 'The rolling hills.', kanaGroup: ['ra', 'ri', 'ru', 're', 'ro'], order: 9 },
  { id: 'district_10', name: 'Wa-Wo Waterfront', description: 'The journey\'s end.', kanaGroup: ['wa', 'wo', 'n'], order: 10 },
];
