import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { MapViewComponent } from './map-view/map-view.component';
import { StoryViewComponent } from './story-view/story-view.component';
import { ApisViewComponent } from './apis-view/apis-view.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { IntroductionViewComponent } from './introduction-view/introduction-view.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: 'introduction', component: IntroductionViewComponent },
      { path: 'map', component: MapViewComponent },
      // { path: 'story', component: StoryViewComponent },
      { path: 'apis', component: ApisViewComponent },
      { path: 'inv', component: InventoryViewComponent },
      { path: '', redirectTo: '/introduction', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
