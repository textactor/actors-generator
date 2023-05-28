export interface TextEnumerator {
  next(): Promise<string[]>;
}
