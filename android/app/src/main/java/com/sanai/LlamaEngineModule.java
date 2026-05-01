package com.sanai;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class LlamaEngineModule extends ReactContextBaseJavaModule {
    private static final String TAG = "LlamaEngineModule";
    private static final String EVENT_TOKEN = "onToken";
    private static final String EVENT_COMPLETE = "onComplete";
    private static final String EVENT_ERROR = "onError";
    private static final String EVENT_PROGRESS = "onProgress";
    private static final String EVENT_TOOL_CALL = "onToolCall";

    private long context = 0;
    private boolean isGenerating = false;

    public LlamaEngineModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "LlamaEngineModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void initialize(ReadableMap config, Promise promise) {
        try {
            String modelPath = config.getString("modelPath");
            int contextLength = config.getInt("contextLength");
            int threads = config.getInt("threads");
            int gpuLayers = config.getInt("gpuLayers");

            Log.d(TAG, "Initializing with model: " + modelPath);
            Log.d(TAG, "Context length: " + contextLength + ", Threads: " + threads);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Initialization failed", e);
            promise.reject("INIT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void loadModel(String modelPath, ReadableMap config, Promise promise) {
        try {
            int contextLength = config.hasKey("contextLength") ? config.getInt("contextLength") : 4096;
            int threads = config.hasKey("threads") ? config.getInt("threads") : 4;
            int gpuLayers = config.hasKey("gpuLayers") ? config.getInt("gpuLayers") : 35;

            Log.d(TAG, "Loading model: " + modelPath);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Model loading failed", e);
            promise.reject("LOAD_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void unloadModel(Promise promise) {
        try {
            context = 0;
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("UNLOAD_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void generate(String prompt, ReadableMap config, Promise promise) {
        try {
            double temperature = config.hasKey("temperature") ? config.getDouble("temperature") : 0.7;
            double topP = config.hasKey("topP") ? config.getDouble("topP") : 0.9;
            int topK = config.hasKey("topK") ? config.getInt("topK") : 40;
            double repeatPenalty = config.hasKey("repeatPenalty") ? config.getDouble("repeatPenalty") : 1.1;
            int maxTokens = config.hasKey("maxTokens") ? config.getInt("maxTokens") : 2048;

            isGenerating = true;

            Log.d(TAG, "Generating with temperature: " + temperature);
            promise.resolve(true);
        } catch (Exception e) {
            isGenerating = false;
            promise.reject("GENERATE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopGeneration(Promise promise) {
        try {
            isGenerating = false;
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("STOP_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getRamUsage(Promise promise) {
        try {
            Runtime runtime = Runtime.getRuntime();
            long usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024);
            long maxMemory = runtime.maxMemory() / (1024 * 1024);

            WritableMap result = Arguments.createMap();
            result.putInt("used", (int) usedMemory);
            result.putInt("total", (int) maxMemory);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("RAM_ERROR", e.getMessage());
        }
    }

    private void sendEvent(String eventName, String data) {
        try {
            ReactContext reactContext = getReactApplicationContext();
            WritableMap params = Arguments.createMap();
            params.putString("type", eventName);
            params.putString("data", data);
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        } catch (Exception e) {
            Log.e(TAG, "Failed to send event: " + eventName, e);
        }
    }

    private void sendEvent(String eventName, WritableMap data) {
        try {
            ReactContext reactContext = getReactApplicationContext();
            WritableMap params = Arguments.createMap();
            params.putString("type", eventName);
            params.putMap("data", data);
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        } catch (Exception e) {
            Log.e(TAG, "Failed to send event: " + eventName, e);
        }
    }
}
