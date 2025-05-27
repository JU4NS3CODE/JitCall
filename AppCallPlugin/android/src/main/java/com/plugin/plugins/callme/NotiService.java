package com.plugin.plugins.callme;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Notification;
import android.media.AudioAttributes;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;


import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;


public class NotiService extends FirebaseMessagingService {

  private static final String CHANNEL_ID = "CALL_NOTIFICATION_CHANNEL";

  @Override
  public void onNewToken(String token) {
    super.onNewToken(token);
    System.out.print("onNewToken");
    Log.d("FCMPlugin", "Nuevo token: " + token);
  }

  @Override
  public void onMessageReceived(RemoteMessage remoteMessage) {
    super.onMessageReceived(remoteMessage);
    Log.d("FCMPlugin", "Mensaje FCM recibido");

    if (remoteMessage.getNotification() != null) {
      Log.d("FCMPlugin", "Título: " + remoteMessage.getNotification().getTitle());
      Log.d("FCMPlugin", "Cuerpo: " + remoteMessage.getNotification().getBody());
    }

    if (remoteMessage.getData().size() > 0) {
      Log.d("FCMPlugin", "Datos recibidos: " + remoteMessage.getData());

      String meetingId = remoteMessage.getData().get("meetingId");
      String name = remoteMessage.getData().get("name");
      String userFrom = remoteMessage.getData().get("userFrom");

      Log.d("FCMPlugin", "meetingId: " + meetingId);
      Log.d("FCMPlugin", "name: " + name);
      Log.d("FCMPlugin", "userFrom: " + userFrom);
    }
  }
  private void showIncomingCallScreen(String meetingId, String callerName, String userFrom) {
    createNotificationChannel();

  }

  private void createNotificationChannel() {
    System.out.print("createNotificationChannel");
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      String channelId = CHANNEL_ID;
      CharSequence channelName = "Llamadas entrantes";
      String channelDescription = "Canal para notificaciones de llamadas tipo videollamada";
      int importance = NotificationManager.IMPORTANCE_HIGH;

      NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
      channel.setDescription(channelDescription);
      channel.enableLights(true);
      channel.enableVibration(true);
      channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
      channel.setSound(
        Settings.System.DEFAULT_RINGTONE_URI,
        new AudioAttributes.Builder()
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
          .build()
      );

      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
    }
  }

}
