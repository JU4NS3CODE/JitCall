package com.plugin.plugins.callme;

import android.util.Log;

public class AppCallPlugin {

    public String echo(String value) {
        Log.i("Echo", value);
        return value;
    }
}
