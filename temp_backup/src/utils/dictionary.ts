import fs from 'fs';
import path from 'path';
import words from '../data/words.json';

interface WordList {
  words: string[];
}

export class Dictionary {
  private words: string[];
  private readonly wordListPath = path.join(__dirname, '../data/wordList.json');

  constructor() {
    this.words = words;
  }

  async loadWords(): Promise<void> {
    try {
      const data = await fs.promises.readFile(this.wordListPath, 'utf-8');
      const wordList: WordList = JSON.parse(data);
      this.words = wordList.words.map(word => word.toLowerCase());
    } catch (error) {
      console.error('Error loading word list:', error);
      throw new Error('Failed to load word list');
    }
  }

  getWordCount(): number {
    return this.words.length;
  }

  isValidWord(word: string): boolean {
    return this.words.includes(word.toUpperCase());
  }

  getWords(): string[] {
    return this.words;
  }
} 