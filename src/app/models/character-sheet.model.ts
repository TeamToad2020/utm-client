
export interface CharSheet {
    name: string;
    type: string;
    lifespan: string;
    origin: string;
    story: string;
    sources: string[]; // of URLS
    image: { imageUrl: string; sourceUrl: string; sourceName: string }; // URL
    linkedStoryId: string;
  }