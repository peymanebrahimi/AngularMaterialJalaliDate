import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  jsonDate = "2018-10-15T20:21:29.4674496";
  dateControl = new FormControl(this.jsonDate);
}
