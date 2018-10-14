import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WebsocketService} from './websocket/websocket.service';
import {WS} from './websocket.events';
import {SubscriptionLike} from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html'
})

export class AboutComponent implements OnInit, OnDestroy {

  myForm: FormGroup;
  serverConnectionsSub: SubscriptionLike;
  serverConnections = 0;

  constructor(private fb: FormBuilder, private wsService: WebsocketService) {
  }

  ngOnDestroy() {
    this.serverConnectionsSub.unsubscribe();
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      text: [null, []]
    });

    this.serverConnectionsSub =
      this.wsService.on<number>('connections')
          .subscribe(value => this.serverConnections = value);

    this.wsService.onReady()
        .subscribe(() => {
          this.wsService.send('connections');
        });
  }

}
