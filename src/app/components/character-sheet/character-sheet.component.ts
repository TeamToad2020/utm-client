import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { Story } from '../../models/story.model';
import { CharSheet } from '../../models/character-sheet.model';

@Component({
  selector: 'utm-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit {
  charSheet: CharSheet;
  story: Story;

  constructor(public routes: RoutesService) {}

  ngOnInit() {
    this.story = this.routes.getSelectedStory();
    this.charSheet = this.routes.getCharacterSheetByStoryId(this.story['@id']);
  }
}
