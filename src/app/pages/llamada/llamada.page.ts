import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LlamadaService } from 'src/app/core/services/llamada.service';

@Component({
  selector: 'app-llamada',
  templateUrl: './llamada.page.html',
  styleUrls: ['./llamada.page.scss'],
  standalone: false
})
export class LlamadaPage {

  meetingId: string = '';
  name: string = '';
  callername: string = '';

  constructor(
    private llamadaService: LlamadaService,
    private router: Router,
    ) {}

  ionViewWillEnter() {
    const navigation = history.state;
    this.meetingId = navigation.meetingId || '';
    this.callername = navigation.callerName || 'Incoming call';
    this.name = "Jose Jose";
  }

  async acceptCall() {
    this.llamadaService.acceptCall(this.meetingId,this.name).then(() => this.router.navigate(['/home']));
  }

  async rejectCall() {
    await this.llamadaService.rejectCall()
  }

}
