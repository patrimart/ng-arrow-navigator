import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ArrowNavigatorDirective } from "../directive/arrow-navigator.directive";

@NgModule({
  declarations: [
    AppComponent,
    ArrowNavigatorDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
