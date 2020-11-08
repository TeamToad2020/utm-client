export interface CharSheet {
  name: string;
  type: string;
  lifespan: string;
  origin: string;
  story: string;
  sources: {
    websites: string[]; // of URLS
    books: string;
  }
  image: { imageUrl: string; sourceUrl: string; sourceName: string }; // URL
  linkedStoryId: string;
}
