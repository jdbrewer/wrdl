import { getValidWords, getWordBank, isValidWord as isValidWordFromBank, getRandomWord as getRandomWordFromBank } from './wordBank';

export class Dictionary {
  private validWords: string[] = [];
  private wordBank: string[] = [];

  async initialize() {
    console.log('Initializing dictionary...');
    this.validWords = await getValidWords();
    this.wordBank = await getWordBank();
    console.log('Dictionary initialized with', this.validWords.length, 'valid words and', this.wordBank.length, 'word bank words');
  }

  getWords(): string[] {
    return this.wordBank;
  }

  async isValidWord(word: string): Promise<boolean> {
    console.log('Dictionary checking word:', word);
    const result = await isValidWordFromBank(word);
    console.log('Dictionary validation result:', result);
    return result;
  }

  async getRandomWord(): Promise<string> {
    console.log('Dictionary getting random word...');
    const word = await getRandomWordFromBank();
    console.log('Dictionary selected word:', word);
    return word;
  }
} 