import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { AudioRecorder } from '../home/audioRecorder';
import { Note } from "../home/note";
import { HomePageRoutingModule } from './home-routing.module';
import { Media } from '@ionic-native/media/ngx'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  providers: [
    AudioRecorder,
    Note
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
