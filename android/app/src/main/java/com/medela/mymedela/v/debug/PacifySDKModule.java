package com.medela.mymedela.v.debug;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.masslight.lib.pacifysdk.sdk.PacifySdk;

public class PacifySDKModule extends ReactContextBaseJavaModule implements PacifySdk.PacifyDelegate {
    private static ReactApplicationContext reactContext;
    private static final String TAG = PacifySDKModule.class.getCanonicalName();

    PacifySDKModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "PacifySDKModule";
    }


    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    public void callPacify(ReadableMap args, Callback cb) {

        String apiKey = args.hasKey("apiKey") ? args.getString("apiKey") : "" ;
        String userToken = args.hasKey("userToken") ? args.getString("userToken") : "";
        String coupon = args.hasKey("coupon") ? args.getString("coupon") : "";
          String name= args.hasKey("name") ? args.getString("name") : "";
          String email= args.hasKey("email") ? args.getString("email") : "";
        Log.d(TAG, String.format("API_KEY: %s", apiKey));
        Log.d(TAG, String.format("USER_TOKEN: %s", userToken));
        Log.d(TAG, String.format("API_KEY: %s", coupon));

        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, PacifySDKActivity.class);
            intent.putExtra("apiKey", apiKey);
            intent.putExtra("userToken", userToken);
            intent.putExtra("coupon", coupon);
            intent.putExtra("name", name);
            intent.putExtra("email", email);
            activity.startActivity(intent);
            cb.invoke("Starting PacifySDK");
        }
    }

    @Override
    public void onComplete() {

    }

    @Override
    public void onError(Throwable exception) {

    }
}