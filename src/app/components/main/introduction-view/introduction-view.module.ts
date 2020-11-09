import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StoryViewModule } from '../story-view/story-view.module';
import { SourceModule } from '../../shared/source/source-component/source.module';
import { IntroductionViewComponent } from './introduction-view.component';

@NgModule({
  declarations: [IntroductionViewComponent],
  imports: [CommonModule, IonicModule, StoryViewModule, SourceModule],
})
export class IntroductionViewModule {}
