import { KanaCharacter } from '../types';

export const hiraganaData: KanaCharacter[] = [
  // Basic vowels
  { id: 'h1', character: 'あ', romaji: 'a', type: 'hiragana', category: 'vowels' },
  { id: 'h2', character: 'い', romaji: 'i', type: 'hiragana', category: 'vowels' },
  { id: 'h3', character: 'う', romaji: 'u', type: 'hiragana', category: 'vowels' },
  { id: 'h4', character: 'え', romaji: 'e', type: 'hiragana', category: 'vowels' },
  { id: 'h5', character: 'お', romaji: 'o', type: 'hiragana', category: 'vowels' },
  
  // K sounds
  { id: 'h6', character: 'か', romaji: 'ka', type: 'hiragana', category: 'k-sounds' },
  { id: 'h7', character: 'き', romaji: 'ki', type: 'hiragana', category: 'k-sounds' },
  { id: 'h8', character: 'く', romaji: 'ku', type: 'hiragana', category: 'k-sounds' },
  { id: 'h9', character: 'け', romaji: 'ke', type: 'hiragana', category: 'k-sounds' },
  { id: 'h10', character: 'こ', romaji: 'ko', type: 'hiragana', category: 'k-sounds' },
  
  // S sounds
  { id: 'h11', character: 'さ', romaji: 'sa', type: 'hiragana', category: 's-sounds' },
  { id: 'h12', character: 'し', romaji: 'shi', type: 'hiragana', category: 's-sounds' },
  { id: 'h13', character: 'す', romaji: 'su', type: 'hiragana', category: 's-sounds' },
  { id: 'h14', character: 'せ', romaji: 'se', type: 'hiragana', category: 's-sounds' },
  { id: 'h15', character: 'そ', romaji: 'so', type: 'hiragana', category: 's-sounds' },
  
  // T sounds
  { id: 'h16', character: 'た', romaji: 'ta', type: 'hiragana', category: 't-sounds' },
  { id: 'h17', character: 'ち', romaji: 'chi', type: 'hiragana', category: 't-sounds' },
  { id: 'h18', character: 'つ', romaji: 'tsu', type: 'hiragana', category: 't-sounds' },
  { id: 'h19', character: 'て', romaji: 'te', type: 'hiragana', category: 't-sounds' },
  { id: 'h20', character: 'と', romaji: 'to', type: 'hiragana', category: 't-sounds' },
  
  // N sounds
  { id: 'h21', character: 'な', romaji: 'na', type: 'hiragana', category: 'n-sounds' },
  { id: 'h22', character: 'に', romaji: 'ni', type: 'hiragana', category: 'n-sounds' },
  { id: 'h23', character: 'ぬ', romaji: 'nu', type: 'hiragana', category: 'n-sounds' },
  { id: 'h24', character: 'ね', romaji: 'ne', type: 'hiragana', category: 'n-sounds' },
  { id: 'h25', character: 'の', romaji: 'no', type: 'hiragana', category: 'n-sounds' },
  
  // H sounds
  { id: 'h26', character: 'は', romaji: 'ha', type: 'hiragana', category: 'h-sounds' },
  { id: 'h27', character: 'ひ', romaji: 'hi', type: 'hiragana', category: 'h-sounds' },
  { id: 'h28', character: 'ふ', romaji: 'fu', type: 'hiragana', category: 'h-sounds' },
  { id: 'h29', character: 'へ', romaji: 'he', type: 'hiragana', category: 'h-sounds' },
  { id: 'h30', character: 'ほ', romaji: 'ho', type: 'hiragana', category: 'h-sounds' },
  
  // M sounds
  { id: 'h31', character: 'ま', romaji: 'ma', type: 'hiragana', category: 'm-sounds' },
  { id: 'h32', character: 'み', romaji: 'mi', type: 'hiragana', category: 'm-sounds' },
  { id: 'h33', character: 'む', romaji: 'mu', type: 'hiragana', category: 'm-sounds' },
  { id: 'h34', character: 'め', romaji: 'me', type: 'hiragana', category: 'm-sounds' },
  { id: 'h35', character: 'も', romaji: 'mo', type: 'hiragana', category: 'm-sounds' },
  
  // Y sounds
  { id: 'h36', character: 'や', romaji: 'ya', type: 'hiragana', category: 'y-sounds' },
  { id: 'h37', character: 'ゆ', romaji: 'yu', type: 'hiragana', category: 'y-sounds' },
  { id: 'h38', character: 'よ', romaji: 'yo', type: 'hiragana', category: 'y-sounds' },
  
  // R sounds
  { id: 'h39', character: 'ら', romaji: 'ra', type: 'hiragana', category: 'r-sounds' },
  { id: 'h40', character: 'り', romaji: 'ri', type: 'hiragana', category: 'r-sounds' },
  { id: 'h41', character: 'る', romaji: 'ru', type: 'hiragana', category: 'r-sounds' },
  { id: 'h42', character: 'れ', romaji: 're', type: 'hiragana', category: 'r-sounds' },
  { id: 'h43', character: 'ろ', romaji: 'ro', type: 'hiragana', category: 'r-sounds' },
  
  // W sounds and N
  { id: 'h44', character: 'わ', romaji: 'wa', type: 'hiragana', category: 'w-sounds' },
  { id: 'h45', character: 'を', romaji: 'wo', type: 'hiragana', category: 'w-sounds' },
  { id: 'h46', character: 'ん', romaji: 'n', type: 'hiragana', category: 'n-sound' }
];

export const katakanaData: KanaCharacter[] = [
  // Basic vowels
  { id: 'k1', character: 'ア', romaji: 'a', type: 'katakana', category: 'vowels' },
  { id: 'k2', character: 'イ', romaji: 'i', type: 'katakana', category: 'vowels' },
  { id: 'k3', character: 'ウ', romaji: 'u', type: 'katakana', category: 'vowels' },
  { id: 'k4', character: 'エ', romaji: 'e', type: 'katakana', category: 'vowels' },
  { id: 'k5', character: 'オ', romaji: 'o', type: 'katakana', category: 'vowels' },
  
  // K sounds
  { id: 'k6', character: 'カ', romaji: 'ka', type: 'katakana', category: 'k-sounds' },
  { id: 'k7', character: 'キ', romaji: 'ki', type: 'katakana', category: 'k-sounds' },
  { id: 'k8', character: 'ク', romaji: 'ku', type: 'katakana', category: 'k-sounds' },
  { id: 'k9', character: 'ケ', romaji: 'ke', type: 'katakana', category: 'k-sounds' },
  { id: 'k10', character: 'コ', romaji: 'ko', type: 'katakana', category: 'k-sounds' },
  
  // S sounds
  { id: 'k11', character: 'サ', romaji: 'sa', type: 'katakana', category: 's-sounds' },
  { id: 'k12', character: 'シ', romaji: 'shi', type: 'katakana', category: 's-sounds' },
  { id: 'k13', character: 'ス', romaji: 'su', type: 'katakana', category: 's-sounds' },
  { id: 'k14', character: 'セ', romaji: 'se', type: 'katakana', category: 's-sounds' },
  { id: 'k15', character: 'ソ', romaji: 'so', type: 'katakana', category: 's-sounds' },
  
  // T sounds
  { id: 'k16', character: 'タ', romaji: 'ta', type: 'katakana', category: 't-sounds' },
  { id: 'k17', character: 'チ', romaji: 'chi', type: 'katakana', category: 't-sounds' },
  { id: 'k18', character: 'ツ', romaji: 'tsu', type: 'katakana', category: 't-sounds' },
  { id: 'k19', character: 'テ', romaji: 'te', type: 'katakana', category: 't-sounds' },
  { id: 'k20', character: 'ト', romaji: 'to', type: 'katakana', category: 't-sounds' },
  
  // N sounds
  { id: 'k21', character: 'ナ', romaji: 'na', type: 'katakana', category: 'n-sounds' },
  { id: 'k22', character: 'ニ', romaji: 'ni', type: 'katakana', category: 'n-sounds' },
  { id: 'k23', character: 'ヌ', romaji: 'nu', type: 'katakana', category: 'n-sounds' },
  { id: 'k24', character: 'ネ', romaji: 'ne', type: 'katakana', category: 'n-sounds' },
  { id: 'k25', character: 'ノ', romaji: 'no', type: 'katakana', category: 'n-sounds' },
  
  // H sounds
  { id: 'k26', character: 'ハ', romaji: 'ha', type: 'katakana', category: 'h-sounds' },
  { id: 'k27', character: 'ヒ', romaji: 'hi', type: 'katakana', category: 'h-sounds' },
  { id: 'k28', character: 'フ', romaji: 'fu', type: 'katakana', category: 'h-sounds' },
  { id: 'k29', character: 'ヘ', romaji: 'he', type: 'katakana', category: 'h-sounds' },
  { id: 'k30', character: 'ホ', romaji: 'ho', type: 'katakana', category: 'h-sounds' },
  
  // M sounds
  { id: 'k31', character: 'マ', romaji: 'ma', type: 'katakana', category: 'm-sounds' },
  { id: 'k32', character: 'ミ', romaji: 'mi', type: 'katakana', category: 'm-sounds' },
  { id: 'k33', character: 'ム', romaji: 'mu', type: 'katakana', category: 'm-sounds' },
  { id: 'k34', character: 'メ', romaji: 'me', type: 'katakana', category: 'm-sounds' },
  { id: 'k35', character: 'モ', romaji: 'mo', type: 'katakana', category: 'm-sounds' },
  
  // Y sounds
  { id: 'k36', character: 'ヤ', romaji: 'ya', type: 'katakana', category: 'y-sounds' },
  { id: 'k37', character: 'ユ', romaji: 'yu', type: 'katakana', category: 'y-sounds' },
  { id: 'k38', character: 'ヨ', romaji: 'yo', type: 'katakana', category: 'y-sounds' },
  
  // R sounds
  { id: 'k39', character: 'ラ', romaji: 'ra', type: 'katakana', category: 'r-sounds' },
  { id: 'k40', character: 'リ', romaji: 'ri', type: 'katakana', category: 'r-sounds' },
  { id: 'k41', character: 'ル', romaji: 'ru', type: 'katakana', category: 'r-sounds' },
  { id: 'k42', character: 'レ', romaji: 're', type: 'katakana', category: 'r-sounds' },
  { id: 'k43', character: 'ロ', romaji: 'ro', type: 'katakana', category: 'r-sounds' },
  
  // W sounds and N
  { id: 'k44', character: 'ワ', romaji: 'wa', type: 'katakana', category: 'w-sounds' },
  { id: 'k45', character: 'ヲ', romaji: 'wo', type: 'katakana', category: 'w-sounds' },
  { id: 'k46', character: 'ン', romaji: 'n', type: 'katakana', category: 'n-sound' }
];

export const getAllKana = (): KanaCharacter[] => [...hiraganaData, ...katakanaData];