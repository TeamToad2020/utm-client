import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsComponent } from './tabs.component';
import { StoryViewModule } from './story-view/story-view.module';
import { MapViewModule } from './map-view/map-view.module';
import { ApisViewModule } from './apis-view/apis-view.module';
import { InventoryViewModule } from './inventory-view/inventory-view.module';
import { IntroductionViewModule } from './introduction-view/introduction-view.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    StoryViewModule,
    MapViewModule,
    ApisViewModule,
    InventoryViewModule,
    IntroductionViewModule,
  ],
  declarations: [TabsComponent],
})
export class TabsPageModule {}
