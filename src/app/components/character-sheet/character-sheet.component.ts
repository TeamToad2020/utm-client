import { Component, OnInit } from '@angular/core';

interface CharSheet {
  name: string;
  type: string;
  lifespan: string;
  origin: string;
  story: string;
  sources: string[]; // of URLS
  image: { imageUrl: string; sourceUrl: string; sourceName: string }; // URL
}

const charSheetExample = {
  name: 'Jan VI de Oude',
  type: 'Human Count',
  lifespan: '22 November 1536 – 8 October 1606',
  origin: 'Jan was born into the noble House of Nassau.',
  story:
    'Jan was the second child and inherited the family’s estate in Germany..Jan had a short\n'
    + 'career as the stadtholder of Gelre. He then was summoned by his brother Willem to\n'
    + 'supervise the Union of Utrecht formation. This treaty united the northern provinces in the\n'
    + 'Netherlands against the Spanish influence. The Union was signed in the kapittel hall in the\n'
    + 'Academy Building.',
  sources: ['https://nl.wikipedia.org/wiki/Jan_VI_van_Nassau-Dillenburg'],
  image: {
    imageUrl: '/assets/img/jan-vi-de-oude.jpg',
    sourceUrl:
      'https://hetutrechtsarchief.nl/beeld/9BC55A6DC61D5C8B8CA8E53E0B61145D',
    sourceName: '39054 / collectie Het Utrechts Archief.',
  },
};

@Component({
  selector: 'utm-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit {
  charSheet: CharSheet;

  constructor() {}

  ngOnInit() {
    this.charSheet = charSheetExample;
  }
}
