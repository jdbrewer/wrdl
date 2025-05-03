// Cache the word lists
let validWords: string[] | null = null;
let wordBank: string[] | null = null;

// Read and parse the CSV files
const readWordFile = async (filePath: string): Promise<string[]> => {
  try {
    console.log('Loading word file:', filePath);
    const response = await fetch(filePath);
    const content = await response.text();
    const words = content.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length === 5);
    console.log(`Loaded ${words.length} words from ${filePath}`);
    return words;
  } catch (error) {
    console.error('Error loading word list:', error);
    return [];
  }
};

export const getValidWords = async (): Promise<string[]> => {
  if (!validWords) {
    validWords = await readWordFile('/data/valid-words.csv');
  }
  return validWords;
};

export const getWordBank = async (): Promise<string[]> => {
  if (!wordBank) {
    wordBank = await readWordFile('/data/word-bank.csv');
  }
  return wordBank;
};

export const isValidWord = async (word: string): Promise<boolean> => {
  const words = await getValidWords();
  const result = words.includes(word.toLowerCase());
  console.log(`Checking if "${word}" is valid:`, result);
  return result;
};

export const getRandomWord = async (): Promise<string> => {
  const words = await getWordBank();
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  console.log('Selected random word:', word);
  return word;
}; 