package com.plugin.plugins.callme;


import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import org.jitsi.meet.sdk.JitsiMeetActivity;
import org.jitsi.meet.sdk.JitsiMeetConferenceOptions;
import org.jitsi.meet.sdk.JitsiMeetUserInfo;

import java.net.URL;

public class JitCall extends AppCompatActivity {

  private String meetingId;
  private String callerName;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    meetingId = getIntent().getStringExtra("meetingId");
    callerName = getIntent().getStringExtra("callerName");

    joinMeeting(meetingId, callerName);
  }

  private void joinMeeting(String meetingId, String callerName) {
    try {
      URL serverURL = new URL("https://meet.jit.si");

      JitsiMeetUserInfo userInfo = new JitsiMeetUserInfo();
      userInfo.setDisplayName(callerName);

      JitsiMeetConferenceOptions options = new JitsiMeetConferenceOptions.Builder()
        .setServerURL(serverURL)
        .setRoom(meetingId)
        .setUserInfo(userInfo)
        .build();

      JitsiMeetActivity.launch(this, options);

      finish();
    } catch (Exception e) {
      e.printStackTrace();
      finish();
    }
  }
}
