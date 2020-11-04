import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogueModule } from './components/scenes/dialogue/dialogue.module';
import { ArticleModule } from './components/scenes/article/article.module';
import { TimeSliderModule } from './components/scenes/time-slider/time-slider.module';

import 'hammerjs';
import { NgxPopperModule } from 'ngx-popper';
import { SourceTooltipModule } from './components/shared/source/source-tooltip/source-tooltip.module';
import { SourceTooltipComponent } from './components/shared/source/source-tooltip/source-tooltip.component';
import { SourceModule } from './components/shared/source/source-component/source.module';
import { SourceComponent } from './components/shared/source/source-component/source.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { YarnTesterViewComponent } from './components/main/yarn-tester-view/yarn-tester-view.component';
import { VgCoreModule } from 'videogular2/compiled/src/core/core';
import { VgControlsModule } from 'videogular2/compiled/src/controls/controls';
import { MapViewModule } from './components/main/map-view/map-view.module';
import { MarkerPopupComponent } from './components/main/map-view/marker-popup/marker-popup.component';
import { CharacterSheetComponent } from './components/character-sheet/character-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    YarnTesterViewComponent,
    CharacterSheetComponent,
  ],
  entryComponents: [
    SourceTooltipComponent,
    SourceComponent,
    MarkerPopupComponent,
    CharacterSheetComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ArticleModule,
    DialogueModule,
    TimeSliderModule,
    SourceTooltipModule,
    SourceModule,
    NgxPopperModule.forRoot({}),
    DeviceDetectorModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    MapViewModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
