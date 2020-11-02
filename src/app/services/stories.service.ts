import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SeqType, Story, StoryState } from '../models/story.model';
import { Feature, Point } from 'geojson';
import { Author } from '../models/author.model';
import { AuthorsService } from './authors.service';
import { TimePeriod } from '../models/time-period.model';
import { TimePeriodService } from './time-period.service';

@Injectable({
  providedIn: 'root',
})
export class StoriesService {
  all: BehaviorSubject<Story[]>;
  selected: BehaviorSubject<Story[]>;
  filtered: BehaviorSubject<Story[]>;
  currentlyViewed: BehaviorSubject<Story>;

  constructor(
    private http: HttpClient,
    private authors: AuthorsService,
    private timePeriod: TimePeriodService
  ) {
    this.all = new BehaviorSubject<any[]>([]);

    // TODO: Update, story view has been removed
    this.selected = new BehaviorSubject<any[]>([]);
    this.filtered = new BehaviorSubject<any[]>([]);
    this.currentlyViewed = new BehaviorSubject<Story>(null);

    this.authors.selected.subscribe(() => {
      this.updateSelectedStories();
    });

    this.selected.subscribe((stories: Story[]) => {
      if (!stories || stories.length < 1) {
        return;
      }
      localStorage.setItem('storyState', JSON.stringify(stories));
    });

    this.timePeriod.filterRange.subscribe(() => {
      this.updateSelectedStories();
    });

    this.update();
  }

  initFromPersistent() {
    // This function is ran on opening the application.
    // For this prototype we re-use it to set the initial state to localStorage if available.
    const persistentStoryState: Story[] | null = JSON.parse(
      localStorage.getItem('storyState')
    );
    // console.log("INIT STATE", this.selected.getValue(), persistentStoryState); // DEBUG

    if (persistentStoryState) {
      this.all.next(persistentStoryState);
      this.setSelectedStations(persistentStoryState);
    } else {
      this.setSelectedStations(this.all.getValue());
    }
  }

  async update() {
    const stories: any = await this.http
      .get('assets/data-models/stories.json')
      .toPromise();

    // Parse date strings
    stories.map((story, idx) => {
      story['time-period'].start = new Date(story['time-period'].start);
      if (story['time-period'].start < this.timePeriod.earliestDate) {
        this.timePeriod.earliestDate = story['time-period'].start;
      }

      story['time-period'].end = new Date(story['time-period'].end);
      stories[idx] = story;
    });

    this.all.next(stories);
    this.selected.next([]); // Reset, in case the current selection contains deleted items
    this.filtered.next([]); // Reset, in case the current selection contains deleted items
    this.currentlyViewed.next(null);
    this.initFromPersistent();
  }

  // Note that currently only point features are supported. TODO: extend this.
  getAllWithStation(pickedStation: Feature<Point>): Story[] {
    return this.all.getValue().filter(story => {
      return story.stations.find(station => {
        return pickedStation.id === station['@id'];
      });
    });
  }

  getByStoryId(id: string): Story {
    return this.all.getValue().find(story => story['@id'] === id);
  }

  getStorySequenceTypes(story: Story): SeqType[] {
    const sequenceTypes: SeqType[] = [];

    story.seq.forEach(seq => {
      sequenceTypes.push(seq['@type']);
    });

    return sequenceTypes;
  }

  storyContainsAudio(story: Story): boolean {
    let storyHasAudio = false;

    for (const seq of story.seq) {
      const isArticle = seq['@type'] === SeqType.Article;
      const seqHasAudio = 'audio' in seq;

      if (isArticle && seqHasAudio) {
        storyHasAudio = true;
        break;
      }
    }

    return storyHasAudio;
  }

  setCurrentlyViewedStory(storyViewed: Story) {
    this.currentlyViewed.next(storyViewed);
  }

  public updateStoryStateById(storyId: string, newState: StoryState) {
    const updatedSelectedStories = this.selected.getValue();
    // console.log(updatedSelectedStories);

    // Loop through each story
    for (
      let storyIdx = 0;
      storyIdx < updatedSelectedStories.length;
      storyIdx++
    ) {
      const selectedStory = updatedSelectedStories[storyIdx];

      // Is this the story we want to change the state of?
      if (selectedStory['@id'] === storyId) {
        // Change the state of this story
        // console.log('Previous state was', selectedStory.state);
        selectedStory.state = newState;
        // console.log('New state is', selectedStory.state);

        // Save the updated story
        updatedSelectedStories[storyIdx] = selectedStory;
      }
    }

    // Update
    this.selected.next(updatedSelectedStories);
  }

  setSelectedStations(selectedStories: Story[]) {
    selectedStories = selectedStories.filter(story => !story.hidden);
    this.selected.next(selectedStories);

    // Filter selected stories
    const filteredStoriesByAuthor = this.getFilteredStoriesByAuthorIds(
      selectedStories,
      this.authors.selected.getValue()
    );
    const filteredStories = this.getFilteredStoriesByTimePeriod(
      filteredStoriesByAuthor,
      this.timePeriod.filterRange.getValue()
    );
    this.filtered.next(filteredStories);

    this.setCurrentlyViewedStory(selectedStories[0]);
  }

  public getAllSelectedStoryStationIds() {
    return this.selected.getValue().map(story => {
      return story.stations[0];
    });
  }

  private updateSelectedStories() {
    this.setSelectedStations(this.selected.getValue());
  }

  private isStoryInTimePeriod(story: Story, timePeriod: TimePeriod): boolean {
    const storyTimePeriod: TimePeriod = story['time-period'];

    const storyHasStartDate = !isNaN(storyTimePeriod.start.getTime());
    const storyHasEndDate = !isNaN(storyTimePeriod.end.getTime());

    const storyStartsInTimePeriod =
      story['time-period'].start >= timePeriod.start;
    const storyEndsInTimePeriod = story['time-period'].end <= timePeriod.end;

    if (storyHasStartDate && storyHasEndDate) {
      // Story has both a start and an end date
      return storyStartsInTimePeriod && storyEndsInTimePeriod;
    } else if (storyHasStartDate && !storyHasEndDate) {
      // Story only has start date
      return storyStartsInTimePeriod;
    } else if (storyHasEndDate && !storyHasStartDate) {
      // Story only has end date
      return storyEndsInTimePeriod;
    }

    // Story only has no valid dates
    return true;
  }

  private getFilteredStoriesByTimePeriod(
    selectedStories: Story[],
    timePeriod: TimePeriod
  ): Story[] {
    if (!timePeriod || selectedStories.length === 0) {
      return selectedStories;
    }

    return selectedStories.filter(story =>
      this.isStoryInTimePeriod(story, timePeriod)
    );
  }

  private getFilteredStoriesByAuthorIds(
    selectedStories: Story[],
    selectedAuthors: Author[]
  ): Story[] {
    if (!selectedAuthors || selectedStories.length === 0) {
      return selectedStories;
    }

    const selectedAuthorIds: string[] = selectedAuthors.map(author => {
      return author['@id'];
    });
    const isAuthorIdSelected = authorId =>
      selectedAuthorIds.includes(authorId['@id']);
    const isStorySelectedByAuthor = story =>
      story.authors.some(authorId => isAuthorIdSelected(authorId));
    return selectedStories.filter(isStorySelectedByAuthor);
  }

  selectAll() {
    // this.setSelectedStations(this.all.getValue());
  }
}
