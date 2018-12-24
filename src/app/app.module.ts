import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MediaCapture } from '@ionic-native/media-capture';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AudioRecorder} from '../pages/home/audioRecorder';
import { Note } from "../pages/home/note";



@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    MediaCapture,
    SplashScreen,
    AudioRecorder,
    AndroidPermissions,
    Note,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
