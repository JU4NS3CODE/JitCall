import { Component } from '@angular/core';
import { PushNotiService } from './core/services/push-noti.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private pushSrv: PushNotiService) {
    this.pushSrv.registerPush();
  }
}
