package com.plugin.plugins.callme;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.jitsi.meet.sdk.BroadcastEvent;
import org.jitsi.meet.sdk.JitsiMeetActivity;
import org.jitsi.meet.sdk.JitsiMeetConferenceOptions;
import org.jitsi.meet.sdk.JitsiMeetUserInfo;

import java.net.MalformedURLException;
import java.net.URL;

@CapacitorPlugin(name = "AppCallPlugin")
public class AppCallPluginPlugin extends Plugin {

  private BroadcastReceiver broadcastReceiver;

  @PluginMethod
  public void launchCall(PluginCall call) {
    try {
      Intent intent = new Intent(getContext(), JitCall.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      getContext().startActivity(intent);

      call.resolve();
    } catch (Exception e) {
      call.reject("Error al lanzar la llamada: " + e.getMessage());
    }
  }

  @PluginMethod
  public void startCall(PluginCall call) {
    String meetingId = call.getString("meetingId");
    String userName = call.getString("userName");

    if (meetingId == null || userName == null) {
      call.reject("Meeting ID y User Name son requeridos");
      return;
    }

    JitsiMeetUserInfo userInfo = new JitsiMeetUserInfo();
    userInfo.setDisplayName(userName);

    try {
      JitsiMeetConferenceOptions options = new JitsiMeetConferenceOptions.Builder()
        .setServerURL(new URL("https://jitsi1.geeksec.de/"))
        .setRoom(meetingId)
        .setAudioOnly(false)
        .setUserInfo(userInfo)
        .setFeatureFlag("welcomepage.enabled", false)
        .build();

      JitsiMeetActivity.launch(getContext(), options);

      registerForBroadcastMessages();

      call.resolve();
    } catch (MalformedURLException e) {
      call.reject("URL error: " + e.getMessage());
    }
  }

  private void registerForBroadcastMessages() {
    IntentFilter intentFilter = new IntentFilter();
    for (BroadcastEvent.Type type : BroadcastEvent.Type.values()) {
      intentFilter.addAction(type.getAction());
    }

    broadcastReceiver = new JitsiCallBroadcastReceiver();

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
      getContext().registerReceiver(broadcastReceiver, intentFilter, Context.RECEIVER_EXPORTED);
    } else {
      getContext().registerReceiver(broadcastReceiver, intentFilter);
    }
  }

  private void notifyCallEndedToJS() {
    JSObject ret = new JSObject();
    ret.put("ended", true);
    notifyListeners("callEnded", ret);
  }

  private class JitsiCallBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
      BroadcastEvent event = new BroadcastEvent(intent);
      BroadcastEvent.Type type = event.getType();

      if (type == BroadcastEvent.Type.CONFERENCE_TERMINATED) {
        notifyCallEndedToJS();
      }
    }
  }

  @Override
  protected void handleOnDestroy() {
    super.handleOnDestroy();
    if (broadcastReceiver != null) {
      try {
        getContext().unregisterReceiver(broadcastReceiver);
      } catch (Exception ignored) {}
    }
  }
}
