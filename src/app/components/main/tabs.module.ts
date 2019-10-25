import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsComponent } from './tabs.component';
import { StoryViewModule } from './story-view/story-view.module';
import { MapViewModule } from './map-view/map-view.module';
import { ArticleModule } from '../scenes/article/article.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    StoryViewModule,
    MapViewModule,
    ArticleModule,
  ],
  declarations: [TabsComponent],
})
export class TabsPageModule {}
