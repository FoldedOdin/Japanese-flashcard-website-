import { KanaCharacter } from '../types';

// Dev-only data validator
const validateKanaData = (data: KanaCharacter[], scriptType: 'hiragana' | 'katakana') => {
  if (process.env.NODE_ENV === 'development') {
    const romajiMap = new Map<string, string[]>();
    const errors: string[] = [];

    data.forEach((char) => {
      if (!char.id || !char.character || !char.romaji || !char.type || !char.category) {
        errors.push(`Missing required fields in character: ${JSON.stringify(char)}`);
      }

      if (char.type !== scriptType) {
        errors.push(`Invalid scriptType for ${char.character}: expected ${scriptType}, got ${char.type}`);
      }

      if (!romajiMap.has(char.romaji)) {
        romajiMap.set(char.romaji, []);
      }
      romajiMap.get(char.romaji)!.push(char.character);
    });

    romajiMap.forEach((chars, romaji) => {
      if (chars.length > 1) {
        console.info(`[Data Validator] Romaji "${romaji}" used by: ${chars.join(', ')} (${scriptType})`);
      }
    });

    if (errors.length > 0) {
      console.error('[Data Validator] Validation errors found:');
      errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Kana data validation failed. Check console for details.');
    }

    console.info(`[Data Validator] ✓ ${scriptType} data validated successfully (${data.length} characters)`);
  }
};

const applyDefaults = (
  data: Array<Omit<KanaCharacter, 'type'> & { type?: 'hiragana' | 'katakana' }>,
  type: 'hiragana' | 'katakana'
): KanaCharacter[] => {
  return data.map((item) => {
    const isExtended = item.category.startsWith('dakuten') || item.category.startsWith('handakuten');
    const strokeCount = item.strokeCount ?? (item.isCombo ? 4 : isExtended ? 4 : 3);

    return {
      ...item,
      type,
      scriptType: type,
      strokeCount,
    } as KanaCharacter;
  });
};

export const kanaGroups = [
  { id: 'vowels', label: 'Vowels', description: 'あ い う え お' },
  { id: 'k-sounds', label: 'K Sounds', description: 'か き く け こ' },
  { id: 's-sounds', label: 'S Sounds', description: 'さ し す せ そ' },
  { id: 't-sounds', label: 'T Sounds', description: 'た ち つ て と' },
  { id: 'n-sounds', label: 'N Sounds', description: 'な に ぬ ね の' },
  { id: 'h-sounds', label: 'H Sounds', description: 'は ひ ふ へ ほ' },
  { id: 'm-sounds', label: 'M Sounds', description: 'ま み む め も' },
  { id: 'y-sounds', label: 'Y Sounds', description: 'や ゆ よ' },
  { id: 'r-sounds', label: 'R Sounds', description: 'ら り る れ ろ' },
  { id: 'w-sounds', label: 'W Sounds', description: 'わ を ん' },
  { id: 'dakuten', label: 'Dakuten', description: 'が ざ だ ば ぱ' },
  { id: 'yoon', label: 'Yōon Combos', description: 'きゃ しゃ ちゃ みゃ りゃ' }
];

const hiraganaBase: Array<Omit<KanaCharacter, 'type'>> = [
  { id: 'h1', character: 'あ', romaji: 'a', category: 'vowels' },
  { id: 'h2', character: 'い', romaji: 'i', category: 'vowels' },
  { id: 'h3', character: 'う', romaji: 'u', category: 'vowels' },
  { id: 'h4', character: 'え', romaji: 'e', category: 'vowels' },
  { id: 'h5', character: 'お', romaji: 'o', category: 'vowels' },
  { id: 'h6', character: 'か', romaji: 'ka', category: 'k-sounds' },
  { id: 'h7', character: 'き', romaji: 'ki', category: 'k-sounds' },
  { id: 'h8', character: 'く', romaji: 'ku', category: 'k-sounds' },
  { id: 'h9', character: 'け', romaji: 'ke', category: 'k-sounds' },
  { id: 'h10', character: 'こ', romaji: 'ko', category: 'k-sounds' },
  { id: 'h11', character: 'さ', romaji: 'sa', category: 's-sounds' },
  { id: 'h12', character: 'し', romaji: 'shi', category: 's-sounds' },
  { id: 'h13', character: 'す', romaji: 'su', category: 's-sounds' },
  { id: 'h14', character: 'せ', romaji: 'se', category: 's-sounds' },
  { id: 'h15', character: 'そ', romaji: 'so', category: 's-sounds' },
  { id: 'h16', character: 'た', romaji: 'ta', category: 't-sounds' },
  { id: 'h17', character: 'ち', romaji: 'chi', category: 't-sounds' },
  { id: 'h18', character: 'つ', romaji: 'tsu', category: 't-sounds' },
  { id: 'h19', character: 'て', romaji: 'te', category: 't-sounds' },
  { id: 'h20', character: 'と', romaji: 'to', category: 't-sounds' },
  { id: 'h21', character: 'な', romaji: 'na', category: 'n-sounds' },
  { id: 'h22', character: 'に', romaji: 'ni', category: 'n-sounds' },
  { id: 'h23', character: 'ぬ', romaji: 'nu', category: 'n-sounds' },
  { id: 'h24', character: 'ね', romaji: 'ne', category: 'n-sounds' },
  { id: 'h25', character: 'の', romaji: 'no', category: 'n-sounds' },
  { id: 'h26', character: 'は', romaji: 'ha', category: 'h-sounds' },
  { id: 'h27', character: 'ひ', romaji: 'hi', category: 'h-sounds' },
  { id: 'h28', character: 'ふ', romaji: 'fu', category: 'h-sounds' },
  { id: 'h29', character: 'へ', romaji: 'he', category: 'h-sounds' },
  { id: 'h30', character: 'ほ', romaji: 'ho', category: 'h-sounds' },
  { id: 'h31', character: 'ま', romaji: 'ma', category: 'm-sounds' },
  { id: 'h32', character: 'み', romaji: 'mi', category: 'm-sounds' },
  { id: 'h33', character: 'む', romaji: 'mu', category: 'm-sounds' },
  { id: 'h34', character: 'め', romaji: 'me', category: 'm-sounds' },
  { id: 'h35', character: 'も', romaji: 'mo', category: 'm-sounds' },
  { id: 'h36', character: 'や', romaji: 'ya', category: 'y-sounds' },
  { id: 'h37', character: 'ゆ', romaji: 'yu', category: 'y-sounds' },
  { id: 'h38', character: 'よ', romaji: 'yo', category: 'y-sounds' },
  { id: 'h39', character: 'ら', romaji: 'ra', category: 'r-sounds' },
  { id: 'h40', character: 'り', romaji: 'ri', category: 'r-sounds' },
  { id: 'h41', character: 'る', romaji: 'ru', category: 'r-sounds' },
  { id: 'h42', character: 'れ', romaji: 're', category: 'r-sounds' },
  { id: 'h43', character: 'ろ', romaji: 'ro', category: 'r-sounds' },
  { id: 'h44', character: 'わ', romaji: 'wa', category: 'w-sounds' },
  { id: 'h45', character: 'を', romaji: 'wo', category: 'w-sounds' },
  { id: 'h46', character: 'ん', romaji: 'n', category: 'n-sound' }
];

const hiraganaExtended: Array<Omit<KanaCharacter, 'type'>> = [
  { id: 'h47', character: 'が', romaji: 'ga', category: 'dakuten-k' },
  { id: 'h48', character: 'ぎ', romaji: 'gi', category: 'dakuten-k' },
  { id: 'h49', character: 'ぐ', romaji: 'gu', category: 'dakuten-k' },
  { id: 'h50', character: 'げ', romaji: 'ge', category: 'dakuten-k' },
  { id: 'h51', character: 'ご', romaji: 'go', category: 'dakuten-k' },
  { id: 'h52', character: 'ざ', romaji: 'za', category: 'dakuten-s' },
  { id: 'h53', character: 'じ', romaji: 'ji', category: 'dakuten-s' },
  { id: 'h54', character: 'ず', romaji: 'zu', category: 'dakuten-s' },
  { id: 'h55', character: 'ぜ', romaji: 'ze', category: 'dakuten-s' },
  { id: 'h56', character: 'ぞ', romaji: 'zo', category: 'dakuten-s' },
  { id: 'h57', character: 'だ', romaji: 'da', category: 'dakuten-t' },
  { id: 'h58', character: 'ぢ', romaji: 'ji', category: 'dakuten-t' },
  { id: 'h59', character: 'づ', romaji: 'zu', category: 'dakuten-t' },
  { id: 'h60', character: 'で', romaji: 'de', category: 'dakuten-t' },
  { id: 'h61', character: 'ど', romaji: 'do', category: 'dakuten-t' },
  { id: 'h62', character: 'ば', romaji: 'ba', category: 'dakuten-h' },
  { id: 'h63', character: 'び', romaji: 'bi', category: 'dakuten-h' },
  { id: 'h64', character: 'ぶ', romaji: 'bu', category: 'dakuten-h' },
  { id: 'h65', character: 'べ', romaji: 'be', category: 'dakuten-h' },
  { id: 'h66', character: 'ぼ', romaji: 'bo', category: 'dakuten-h' },
  { id: 'h67', character: 'ぱ', romaji: 'pa', category: 'handakuten-h' },
  { id: 'h68', character: 'ぴ', romaji: 'pi', category: 'handakuten-h' },
  { id: 'h69', character: 'ぷ', romaji: 'pu', category: 'handakuten-h' },
  { id: 'h70', character: 'ぺ', romaji: 'pe', category: 'handakuten-h' },
  { id: 'h71', character: 'ぽ', romaji: 'po', category: 'handakuten-h' },
  { id: 'h72', character: 'ゔ', romaji: 'vu', category: 'dakuten-v' },
  { id: 'h73', character: 'きゃ', romaji: 'kya', category: 'combo-k', isCombo: true, base: 'き' },
  { id: 'h74', character: 'きゅ', romaji: 'kyu', category: 'combo-k', isCombo: true, base: 'き' },
  { id: 'h75', character: 'きょ', romaji: 'kyo', category: 'combo-k', isCombo: true, base: 'き' },
  { id: 'h76', character: 'しゃ', romaji: 'sha', category: 'combo-s', isCombo: true, base: 'し' },
  { id: 'h77', character: 'しゅ', romaji: 'shu', category: 'combo-s', isCombo: true, base: 'し' },
  { id: 'h78', character: 'しょ', romaji: 'sho', category: 'combo-s', isCombo: true, base: 'し' },
  { id: 'h79', character: 'ちゃ', romaji: 'cha', category: 'combo-t', isCombo: true, base: 'ち' },
  { id: 'h80', character: 'ちゅ', romaji: 'chu', category: 'combo-t', isCombo: true, base: 'ち' },
  { id: 'h81', character: 'ちょ', romaji: 'cho', category: 'combo-t', isCombo: true, base: 'ち' },
  { id: 'h82', character: 'にゃ', romaji: 'nya', category: 'combo-n', isCombo: true, base: 'に' },
  { id: 'h83', character: 'にゅ', romaji: 'nyu', category: 'combo-n', isCombo: true, base: 'に' },
  { id: 'h84', character: 'にょ', romaji: 'nyo', category: 'combo-n', isCombo: true, base: 'に' },
  { id: 'h85', character: 'ひゃ', romaji: 'hya', category: 'combo-h', isCombo: true, base: 'ひ' },
  { id: 'h86', character: 'ひゅ', romaji: 'hyu', category: 'combo-h', isCombo: true, base: 'ひ' },
  { id: 'h87', character: 'ひょ', romaji: 'hyo', category: 'combo-h', isCombo: true, base: 'ひ' },
  { id: 'h88', character: 'みゃ', romaji: 'mya', category: 'combo-m', isCombo: true, base: 'み' },
  { id: 'h89', character: 'みゅ', romaji: 'myu', category: 'combo-m', isCombo: true, base: 'み' },
  { id: 'h90', character: 'みょ', romaji: 'myo', category: 'combo-m', isCombo: true, base: 'み' },
  { id: 'h91', character: 'りゃ', romaji: 'rya', category: 'combo-r', isCombo: true, base: 'り' },
  { id: 'h92', character: 'りゅ', romaji: 'ryu', category: 'combo-r', isCombo: true, base: 'り' },
  { id: 'h93', character: 'りょ', romaji: 'ryo', category: 'combo-r', isCombo: true, base: 'り' },
  { id: 'h94', character: 'ぎゃ', romaji: 'gya', category: 'combo-g', isCombo: true, base: 'ぎ' },
  { id: 'h95', character: 'ぎゅ', romaji: 'gyu', category: 'combo-g', isCombo: true, base: 'ぎ' },
  { id: 'h96', character: 'ぎょ', romaji: 'gyo', category: 'combo-g', isCombo: true, base: 'ぎ' },
  { id: 'h97', character: 'じゃ', romaji: 'ja', category: 'combo-j', isCombo: true, base: 'じ' },
  { id: 'h98', character: 'じゅ', romaji: 'ju', category: 'combo-j', isCombo: true, base: 'じ' },
  { id: 'h99', character: 'じょ', romaji: 'jo', category: 'combo-j', isCombo: true, base: 'じ' },
  { id: 'h100', character: 'びゃ', romaji: 'bya', category: 'combo-b', isCombo: true, base: 'び' },
  { id: 'h101', character: 'びゅ', romaji: 'byu', category: 'combo-b', isCombo: true, base: 'び' },
  { id: 'h102', character: 'びょ', romaji: 'byo', category: 'combo-b', isCombo: true, base: 'び' },
  { id: 'h103', character: 'ぴゃ', romaji: 'pya', category: 'combo-p', isCombo: true, base: 'ぴ' },
  { id: 'h104', character: 'ぴゅ', romaji: 'pyu', category: 'combo-p', isCombo: true, base: 'ぴ' },
  { id: 'h105', character: 'ぴょ', romaji: 'pyo', category: 'combo-p', isCombo: true, base: 'ぴ' }
];

const katakanaBase: Array<Omit<KanaCharacter, 'type'>> = [
  { id: 'k1', character: 'ア', romaji: 'a', category: 'vowels' },
  { id: 'k2', character: 'イ', romaji: 'i', category: 'vowels' },
  { id: 'k3', character: 'ウ', romaji: 'u', category: 'vowels' },
  { id: 'k4', character: 'エ', romaji: 'e', category: 'vowels' },
  { id: 'k5', character: 'オ', romaji: 'o', category: 'vowels' },
  { id: 'k6', character: 'カ', romaji: 'ka', category: 'k-sounds' },
  { id: 'k7', character: 'キ', romaji: 'ki', category: 'k-sounds' },
  { id: 'k8', character: 'ク', romaji: 'ku', category: 'k-sounds' },
  { id: 'k9', character: 'ケ', romaji: 'ke', category: 'k-sounds' },
  { id: 'k10', character: 'コ', romaji: 'ko', category: 'k-sounds' },
  { id: 'k11', character: 'サ', romaji: 'sa', category: 's-sounds' },
  { id: 'k12', character: 'シ', romaji: 'shi', category: 's-sounds' },
  { id: 'k13', character: 'ス', romaji: 'su', category: 's-sounds' },
  { id: 'k14', character: 'セ', romaji: 'se', category: 's-sounds' },
  { id: 'k15', character: 'ソ', romaji: 'so', category: 's-sounds' },
  { id: 'k16', character: 'タ', romaji: 'ta', category: 't-sounds' },
  { id: 'k17', character: 'チ', romaji: 'chi', category: 't-sounds' },
  { id: 'k18', character: 'ツ', romaji: 'tsu', category: 't-sounds' },
  { id: 'k19', character: 'テ', romaji: 'te', category: 't-sounds' },
  { id: 'k20', character: 'ト', romaji: 'to', category: 't-sounds' },
  { id: 'k21', character: 'ナ', romaji: 'na', category: 'n-sounds' },
  { id: 'k22', character: 'ニ', romaji: 'ni', category: 'n-sounds' },
  { id: 'k23', character: 'ヌ', romaji: 'nu', category: 'n-sounds' },
  { id: 'k24', character: 'ネ', romaji: 'ne', category: 'n-sounds' },
  { id: 'k25', character: 'ノ', romaji: 'no', category: 'n-sounds' },
  { id: 'k26', character: 'ハ', romaji: 'ha', category: 'h-sounds' },
  { id: 'k27', character: 'ヒ', romaji: 'hi', category: 'h-sounds' },
  { id: 'k28', character: 'フ', romaji: 'fu', category: 'h-sounds' },
  { id: 'k29', character: 'ヘ', romaji: 'he', category: 'h-sounds' },
  { id: 'k30', character: 'ホ', romaji: 'ho', category: 'h-sounds' },
  { id: 'k31', character: 'マ', romaji: 'ma', category: 'm-sounds' },
  { id: 'k32', character: 'ミ', romaji: 'mi', category: 'm-sounds' },
  { id: 'k33', character: 'ム', romaji: 'mu', category: 'm-sounds' },
  { id: 'k34', character: 'メ', romaji: 'me', category: 'm-sounds' },
  { id: 'k35', character: 'モ', romaji: 'mo', category: 'm-sounds' },
  { id: 'k36', character: 'ヤ', romaji: 'ya', category: 'y-sounds' },
  { id: 'k37', character: 'ユ', romaji: 'yu', category: 'y-sounds' },
  { id: 'k38', character: 'ヨ', romaji: 'yo', category: 'y-sounds' },
  { id: 'k39', character: 'ラ', romaji: 'ra', category: 'r-sounds' },
  { id: 'k40', character: 'リ', romaji: 'ri', category: 'r-sounds' },
  { id: 'k41', character: 'ル', romaji: 'ru', category: 'r-sounds' },
  { id: 'k42', character: 'レ', romaji: 're', category: 'r-sounds' },
  { id: 'k43', character: 'ロ', romaji: 'ro', category: 'r-sounds' },
  { id: 'k44', character: 'ワ', romaji: 'wa', category: 'w-sounds' },
  { id: 'k45', character: 'ヲ', romaji: 'wo', category: 'w-sounds' },
  { id: 'k46', character: 'ン', romaji: 'n', category: 'n-sound' }
];

const katakanaExtended: Array<Omit<KanaCharacter, 'type'>> = [
  { id: 'k47', character: 'ガ', romaji: 'ga', category: 'dakuten-k' },
  { id: 'k48', character: 'ギ', romaji: 'gi', category: 'dakuten-k' },
  { id: 'k49', character: 'グ', romaji: 'gu', category: 'dakuten-k' },
  { id: 'k50', character: 'ゲ', romaji: 'ge', category: 'dakuten-k' },
  { id: 'k51', character: 'ゴ', romaji: 'go', category: 'dakuten-k' },
  { id: 'k52', character: 'ザ', romaji: 'za', category: 'dakuten-s' },
  { id: 'k53', character: 'ジ', romaji: 'ji', category: 'dakuten-s' },
  { id: 'k54', character: 'ズ', romaji: 'zu', category: 'dakuten-s' },
  { id: 'k55', character: 'ゼ', romaji: 'ze', category: 'dakuten-s' },
  { id: 'k56', character: 'ゾ', romaji: 'zo', category: 'dakuten-s' },
  { id: 'k57', character: 'ダ', romaji: 'da', category: 'dakuten-t' },
  { id: 'k58', character: 'ヂ', romaji: 'ji', category: 'dakuten-t' },
  { id: 'k59', character: 'ヅ', romaji: 'zu', category: 'dakuten-t' },
  { id: 'k60', character: 'デ', romaji: 'de', category: 'dakuten-t' },
  { id: 'k61', character: 'ド', romaji: 'do', category: 'dakuten-t' },
  { id: 'k62', character: 'バ', romaji: 'ba', category: 'dakuten-h' },
  { id: 'k63', character: 'ビ', romaji: 'bi', category: 'dakuten-h' },
  { id: 'k64', character: 'ブ', romaji: 'bu', category: 'dakuten-h' },
  { id: 'k65', character: 'ベ', romaji: 'be', category: 'dakuten-h' },
  { id: 'k66', character: 'ボ', romaji: 'bo', category: 'dakuten-h' },
  { id: 'k67', character: 'パ', romaji: 'pa', category: 'handakuten-h' },
  { id: 'k68', character: 'ピ', romaji: 'pi', category: 'handakuten-h' },
  { id: 'k69', character: 'プ', romaji: 'pu', category: 'handakuten-h' },
  { id: 'k70', character: 'ペ', romaji: 'pe', category: 'handakuten-h' },
  { id: 'k71', character: 'ポ', romaji: 'po', category: 'handakuten-h' },
  { id: 'k72', character: 'ヴ', romaji: 'vu', category: 'dakuten-v' },
  { id: 'k73', character: 'キャ', romaji: 'kya', category: 'combo-k', isCombo: true, base: 'キ' },
  { id: 'k74', character: 'キュ', romaji: 'kyu', category: 'combo-k', isCombo: true, base: 'キ' },
  { id: 'k75', character: 'キョ', romaji: 'kyo', category: 'combo-k', isCombo: true, base: 'キ' },
  { id: 'k76', character: 'シャ', romaji: 'sha', category: 'combo-s', isCombo: true, base: 'シ' },
  { id: 'k77', character: 'シュ', romaji: 'shu', category: 'combo-s', isCombo: true, base: 'シ' },
  { id: 'k78', character: 'ショ', romaji: 'sho', category: 'combo-s', isCombo: true, base: 'シ' },
  { id: 'k79', character: 'チャ', romaji: 'cha', category: 'combo-t', isCombo: true, base: 'チ' },
  { id: 'k80', character: 'チュ', romaji: 'chu', category: 'combo-t', isCombo: true, base: 'チ' },
  { id: 'k81', character: 'チョ', romaji: 'cho', category: 'combo-t', isCombo: true, base: 'チ' },
  { id: 'k82', character: 'ニャ', romaji: 'nya', category: 'combo-n', isCombo: true, base: 'ニ' },
  { id: 'k83', character: 'ニュ', romaji: 'nyu', category: 'combo-n', isCombo: true, base: 'ニ' },
  { id: 'k84', character: 'ニョ', romaji: 'nyo', category: 'combo-n', isCombo: true, base: 'ニ' },
  { id: 'k85', character: 'ヒャ', romaji: 'hya', category: 'combo-h', isCombo: true, base: 'ヒ' },
  { id: 'k86', character: 'ヒュ', romaji: 'hyu', category: 'combo-h', isCombo: true, base: 'ヒ' },
  { id: 'k87', character: 'ヒョ', romaji: 'hyo', category: 'combo-h', isCombo: true, base: 'ヒ' },
  { id: 'k88', character: 'ミャ', romaji: 'mya', category: 'combo-m', isCombo: true, base: 'ミ' },
  { id: 'k89', character: 'ミュ', romaji: 'myu', category: 'combo-m', isCombo: true, base: 'ミ' },
  { id: 'k90', character: 'ミョ', romaji: 'myo', category: 'combo-m', isCombo: true, base: 'ミ' },
  { id: 'k91', character: 'リャ', romaji: 'rya', category: 'combo-r', isCombo: true, base: 'リ' },
  { id: 'k92', character: 'リュ', romaji: 'ryu', category: 'combo-r', isCombo: true, base: 'リ' },
  { id: 'k93', character: 'リョ', romaji: 'ryo', category: 'combo-r', isCombo: true, base: 'リ' },
  { id: 'k94', character: 'ギャ', romaji: 'gya', category: 'combo-g', isCombo: true, base: 'ギ' },
  { id: 'k95', character: 'ギュ', romaji: 'gyu', category: 'combo-g', isCombo: true, base: 'ギ' },
  { id: 'k96', character: 'ギョ', romaji: 'gyo', category: 'combo-g', isCombo: true, base: 'ギ' },
  { id: 'k97', character: 'ジャ', romaji: 'ja', category: 'combo-j', isCombo: true, base: 'ジ' },
  { id: 'k98', character: 'ジュ', romaji: 'ju', category: 'combo-j', isCombo: true, base: 'ジ' },
  { id: 'k99', character: 'ジョ', romaji: 'jo', category: 'combo-j', isCombo: true, base: 'ジ' },
  { id: 'k100', character: 'ビャ', romaji: 'bya', category: 'combo-b', isCombo: true, base: 'ビ' },
  { id: 'k101', character: 'ビュ', romaji: 'byu', category: 'combo-b', isCombo: true, base: 'ビ' },
  { id: 'k102', character: 'ビョ', romaji: 'byo', category: 'combo-b', isCombo: true, base: 'ビ' },
  { id: 'k103', character: 'ピャ', romaji: 'pya', category: 'combo-p', isCombo: true, base: 'ピ' },
  { id: 'k104', character: 'ピュ', romaji: 'pyu', category: 'combo-p', isCombo: true, base: 'ピ' },
  { id: 'k105', character: 'ピョ', romaji: 'pyo', category: 'combo-p', isCombo: true, base: 'ピ' }
];

export const hiraganaData: KanaCharacter[] = applyDefaults(
  [...hiraganaBase, ...hiraganaExtended],
  'hiragana'
);

export const katakanaData: KanaCharacter[] = applyDefaults(
  [...katakanaBase, ...katakanaExtended],
  'katakana'
);

validateKanaData(hiraganaData, 'hiragana');
validateKanaData(katakanaData, 'katakana');

export const getAllKana = (): KanaCharacter[] => [...hiraganaData, ...katakanaData];
