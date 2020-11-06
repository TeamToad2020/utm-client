import { CharSheet } from './character-sheet.model';
import { Story, StoryId } from './story.model';

export interface RouteModel {
  '@id': string;
  storyIds: StoryId[];
  stories?: Story[];
  charSheets: CharSheet[];
  properties: {
    title: string;
    description: string;
    color: string;
    hideLines: boolean;
  };
}

export interface RouteId {
  '@id': string;
}
