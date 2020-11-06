import { Component, Input, OnInit } from '@angular/core';
import { SeqType, Story, StoryState } from '../../../../models/story.model';
import { StoriesService } from '../../../../services/stories.service';
import { RoutesService } from '../../../../services/routes.service';
import { Platform } from '@ionic/angular';
import { Browser } from '@capacitor/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { StationsService } from '../../../../services/stations.service';
import { CharacterSheetComponent } from '../../../character-sheet/character-sheet.component';
// import { MapInfoUIService } from '../../../../services/map-info-ui.service';

@Component({
  selector: 'utm-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent implements OnInit {
  story: Story;
  sources: any[];
  storyState = StoryState;
  isInRange = true;

  constructor(
    stories: StoriesService,
    public platform: Platform,
    public router: Router,
    public routes: RoutesService,
    private stations: StationsService,
    // public mapInfoUI: MapInfoUIService
    private popoverController: PopoverController
  ) {
    this.sources = [
      {
        src: 'http://static.videogular.com/assets/audios/videogular.mp3',
        type: 'audio/mp3',
      },
    ];
  }

  ngOnInit() {
    this.story = this.routes.getSelectedStory();
    console.log(this.story.stations[0]);
    //Un comment to enable geolocation feature.
    //this.GeolocationFeature();
  }

  GeolocationFeature() {
    this.isInRange = this.stations.getStationById(
      this.story.stations[0]['@id']
    ).isInRange;
  }

  async DismissPopover() {
    await this.popoverController.dismiss();
  }

  startStory(story: Story) {
    this.routes.all.subscribe(_ => {
      story = this.routes.getSelectedStory();
    });
    this.routes.selectedStoryIdx.subscribe(selectedStoryIdx => {
      story = this.routes.getSelectedStory();
      console.log(story.description);
    });
    // TODO: Implement actual sequence logic here
    // For now, only load first sequence item
    const firstSeqItem = story.seq[0];
    switch (firstSeqItem['@type']) {
      // case SeqType.Article:
      //   this.router.navigate([
      //     '/article',
      //     { storyId: story['@id'], seqId: firstSeqItem['@id'] },
      //   ]);
      //   break;
      case SeqType.Dialogue:
        this.router.navigate([
          '/dialogue',
          { storyId: story['@id'], seqId: firstSeqItem['@id'] },
        ]);
        this.DismissPopover();
        break;
      // case SeqType.External:
      //   Browser.open({ url: firstSeqItem['content'] });
      //   break;
      // case SeqType.TimeSlider:
      //   this.router.navigate([
      //     '/timeslider',
      //     { storyId: story['@id'], seqId: firstSeqItem['@id'] },
      //   ]);
      //   break;
      default:
        console.error('Unsupported story type', firstSeqItem['@type']);
        break;
    }
  }

  async goToCharacterPage() {
    const popover = await this.popoverController.create({
      component: CharacterSheetComponent,
      componentProps: {
        story: this.story,
        storyId: this.story['@id'],
      },
      cssClass: 'character-sheet-popover',
    });
    return await popover.present();
  }
}
