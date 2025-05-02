import { Dictionary } from '../utils/dictionary';

describe('Dictionary', () => {
  let dictionary: Dictionary;

  beforeEach(() => {
    dictionary = new Dictionary();
  });

  test('should load words from file', async () => {
    await dictionary.loadWords();
    expect(dictionary.getWordCount()).toBeGreaterThan(0);
  });

  test('should check if word exists', async () => {
    await dictionary.loadWords();
    expect(dictionary.isValidWord('apple')).toBe(true);
    expect(dictionary.isValidWord('xyzzy')).toBe(false);
  });

  test('should validate word length', async () => {
    await dictionary.loadWords();
    expect(dictionary.isValidWord('cat')).toBe(false);
    expect(dictionary.isValidWord('elephant')).toBe(false);
    expect(dictionary.isValidWord('apple')).toBe(true);
  });

  test('should handle case-insensitive words', async () => {
    await dictionary.loadWords();
    expect(dictionary.isValidWord('APPLE')).toBe(true);
    expect(dictionary.isValidWord('aPpLe')).toBe(true);
  });

  test('should contain all words from the list', async () => {
    await dictionary.loadWords();
    const testWords = ['apple', 'beach', 'chair', 'dance', 'eagle'];
    testWords.forEach(word => {
      expect(dictionary.isValidWord(word)).toBe(true);
    });
  });

  test('should reject non-existent words', async () => {
    await dictionary.loadWords();
    const invalidWords = ['aaaaa', 'bbbbb', 'ccccc', 'ddddd', 'eeeee'];
    invalidWords.forEach(word => {
      expect(dictionary.isValidWord(word)).toBe(false);
    });
  });
}); 