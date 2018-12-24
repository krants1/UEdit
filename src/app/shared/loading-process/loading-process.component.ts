import {Component, Input, OnInit} from '@angular/core';
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-loading-process',
  templateUrl: './loading-process.component.html',
  styleUrls: ['./loading-process.component.css']
})

export class LoadingProcessComponent {

  isLoadingProcess = false;
  timerShow: Timer;

  @Input()
  delayShowAfter = 250;

  @Input('isLoading')
  set isLoading(value: boolean) {
    if (value) {
      this.timerShow = setTimeout(() => this.isLoadingProcess = true, this.delayShowAfter);
    } else {
      this.isLoadingProcess = false;
      clearTimeout(this.timerShow);
    }
  }

  constructor() {
  }

}
