import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-test-call',
  templateUrl: './test-call.page.html',
  styleUrls: ['./test-call.page.scss'],
  standalone: false
})
export class TestCallPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async startCall() {
    // Logic to start a test call
    console.log('Test call started');
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This function available Android.');
      return;
    }
    try {
      await (window as any).Capacitor.Plugins.AppCallPlugin.startCall({
        meetingId: '1234567890',
        userName: 'Test User',
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

}
