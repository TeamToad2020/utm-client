import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RouteModel } from '../models/route.model';
import { StationsService } from './stations.service';
import { StoriesService } from './stories.service';
import { Story } from '../models/story.model';
import { CharSheet } from '../models/character-sheet.model';
import { StationId } from '../models/station.model';
import { Route } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  all: BehaviorSubject<RouteModel[]>;
  selected: BehaviorSubject<RouteModel>;
  selectedStoryIdx: BehaviorSubject<number>;
  routesOverviewShown = false;
  // charSheets: any;
  allCharSheets: BehaviorSubject<any[]>;

  private readonly DEFAULTSTORYIDX = 8;

  private allStoriesRouteId: string;

  constructor(
    private http: HttpClient,
    private stations: StationsService,
    private stories: StoriesService
  ) {
    this.all = new BehaviorSubject<RouteModel[]>([]);
    this.allCharSheets = new BehaviorSubject<RouteModel[]>([]);
    this.selected = new BehaviorSubject<RouteModel>(undefined);
    this.selectedStoryIdx = new BehaviorSubject<number>(0);

    this.initialize();
  }

  async initialize() {
    const routes: RouteModel[] = await this.http
      .get<RouteModel[]>('/assets/data-models/routes.json')
      .toPromise();

    const charSheets: any = await this.http
      .get('assets/data-models/character-sheets.json')
      .toPromise();
    this.allCharSheets = charSheets;

    this.allStoriesRouteId = routes[0]['@id'];

    this.all.next(routes);

    this.initializeStoryReloading();

    this.selected.next(routes[0]);
    this.selectedStoryIdx.next(this.DEFAULTSTORYIDX);
  }

  private initializeStoryReloading() {
    this.stories.selected.subscribe(allStories => {
      this.reloadRouteStories(allStories);
    });
  }

  private reloadRouteStories(allStories: Story[]) {
    const currentRoutes = this.all.getValue();

    // Add all stories for when no route is selected
    // Internally, "no route" is seen as a route which includes all stories
    const allStoryIds = allStories.map(story => {
      return { '@id': story['@id'] };
    });
    currentRoutes[0].storyIds = allStoryIds;

    currentRoutes.forEach((route, idx) => {
      route.stories = [];

      for (const storyId of route.storyIds) {
        const story: Story = this.stories.getByStoryId(storyId['@id']);
        route.stories.push(story);
      }

      currentRoutes[idx] = route;
    });

    this.all.next(currentRoutes);
  }

  public getAmountStoriesSelectedRoute(): number {
    return this.selected.getValue().stories.length;
  }

  public selectPrevStory() {
    const prevStoryIdx = this.selectedStoryIdx.getValue() - 1;
    if (prevStoryIdx < 0) {
      return;
    }

    this.selectedStoryIdx.next(prevStoryIdx);
  }

  public getRouteStationIds(): string[] {
    const stories = this.selected.getValue().stories;
    const stationIds: string[] = [];
    for (const story of stories) {
      if (story) {
        stationIds.push(story.stations[0]['@id']);
      }
    }
    return stationIds;
  }

  public getSelectedStationId(): StationId {
    const selectedStory: Story = this.getSelectedStory();
    if (!selectedStory) {
      return { '@id': undefined };
    }
    return selectedStory.stations[0];
  }

  public getStoryByStationId(stationId): Story {
    const stories = this.selected.getValue().stories;
    for (let storyIdx = 0; storyIdx < stories.length; storyIdx++) {
      //  Story is currently assumed to only have one associated station
      const story: Story = stories[storyIdx];
      if (stationId === story.stations[0]['@id']) {
        return story;
      }
    }
    return undefined;
  }

  public getCharacterSheetByStoryId(storyId): CharSheet {
    const charSheets: any = this.allCharSheets;
    for (
      let charSheetIdx = 0;
      charSheetIdx < charSheets.length;
      charSheetIdx++
    ) {
      //  Story is currently assumed to only have one associated station
      const charSheet: CharSheet = charSheets[charSheetIdx];
      if (storyId === charSheet.linkedStoryId) {
        return charSheet;
      }
    }
    return undefined;
  }

  public selectStoryByStationId(stationId) {
    const stories = this.selected.getValue().stories;
    for (let storyIdx = 0; storyIdx < stories.length; storyIdx++) {
      // TODO: Support multiple stations for a single story?
      //  Story is currently assumed to only have one associated station
      const story: Story = stories[storyIdx];

      if (stationId === story.stations[0]['@id']) {
        this.selectedStoryIdx.next(storyIdx);
        return;
      }
    }

    console.log(
      'Could not find a story for the clicked station in the selected route, deselecting route.'
    );
    this.deselectRoute();
    this.selectStoryByStationId(stationId);
  }

  public selectFirstStory() {
    this.selectedStoryIdx.next(0);
  }

  public selectLastStory() {
    this.selectedStoryIdx.next(this.getAmountStoriesSelectedRoute() - 1);
  }

  public selectNextStory() {
    const amtStories = this.getAmountStoriesSelectedRoute();

    const nextStoryIdx = this.selectedStoryIdx.getValue() + 1;
    if (nextStoryIdx > amtStories - 1) {
      return;
    }

    this.selectedStoryIdx.next(nextStoryIdx);
  }

  public getSelectedStory(): Story {
    if (!this.selected.getValue() || !this.selected.getValue().stories) {
      return undefined;
    }

    return this.selected.getValue().stories[this.selectedStoryIdx.getValue()];
  }

  public selectRouteById(routeId: string) {
    const selectedRoute: RouteModel = this.getRouteById(routeId);
    this.selected.next(selectedRoute);
    this.selectedStoryIdx.next(0);
    this.routesOverviewShown = true;
    // console.log('Selected route:', this.selected.getValue());
  }

  public getRouteStationCoordinates(route: RouteModel): any {
    return this.getRouteStationCoordinatesById(route['@id']);
  }

  public getRouteStationCoordinatesById(routeId: string): any {
    const route: RouteModel = this.getRouteById(routeId);
    // TODO: Support multiple stations for a single story?
    //  Currently always picks the coordinates of the first story station
    const routeStationCoordinates = route.stories.map(story => {
      return this.stations.getStationById(story.stations[0]['@id']).geometry
        .coordinates;
    });
    return routeStationCoordinates;
  }

  public deselectRoute() {
    const noRoute: RouteModel = this.getRouteById(this.allStoriesRouteId);
    this.selected.next(noRoute);

    this.selectedStoryIdx.next(0);
  }

  public getRouteById(routeId: string): RouteModel {
    return this.all.getValue().find(route => route['@id'] === routeId);
  }

  public getSelectedRoute(): RouteModel {
    return this.selected.getValue();
  }

  public isShowingAllStories(): boolean {
    return this.getSelectedRoute()['@id'] === this.allStoriesRouteId;
  }
}
