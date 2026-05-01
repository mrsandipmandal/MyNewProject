import Foundation
import React

@objc(LlamaEngineModule)
class LlamaEngineModule: RCTEventEmitter {

    private var context: OpaquePointer?
    private var model: OpaquePointer?
    private var isGenerating = false

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override func supportedEvents() -> [String]! {
        return ["onToken", "onComplete", "onError", "onProgress", "onToolCall"]
    }

    @objc(initialize:withResolver:withRejecter:)
    func initialize(_ config: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let modelPath = config["modelPath"] as? String else {
            reject("INIT_ERROR", "Model path is required", nil)
            return
        }

        let contextLength = config["contextLength"] as? Int32 ?? 4096
        let threads = config["threads"] as? Int32 ?? 4
        let gpuLayers = config["gpuLayers"] as? Int32 ?? 35

        // TODO: Initialize llama.cpp
        // var model_params = llama_model_default_params()
        // model_params.n_gpu_layers = gpuLayers
        // model = llama_load_model_from_file(modelPath, model_params)

        print("LlamaEngine: Initializing model at \(modelPath)")
        print("LlamaEngine: Context length: \(contextLength), Threads: \(threads), GPU layers: \(gpuLayers)")

        resolve(true)
    }

    @objc(loadModel:config:withResolver:withRejecter:)
    func loadModel(_ modelPath: String, config: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let contextLength = config["contextLength"] as? Int32 ?? 4096
        let threads = config["threads"] as? Int32 ?? 4

        // TODO: Load model using llama.cpp
        // var ctx_params = llama_context_default_params()
        // ctx_params.n_ctx = contextLength
        // ctx_params.n_threads = threads

        print("LlamaEngine: Loading model \(modelPath)")
        resolve(true)
    }

    @objc(unloadModel:withRejecter:)
    func unloadModel(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        // TODO: Free llama context and model
        // llama_free(context)
        // llama_free_model(model)
        context = nil
        model = nil
        resolve(nil)
    }

    @objc(generate:config:withResolver:withRejecter:)
    func generate(_ prompt: String, config: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let temperature = config["temperature"] as? Float ?? 0.7
        let topP = config["topP"] as? Float ?? 0.9
        let topK = config["topK"] as? Int32 ?? 40
        let maxTokens = config["maxTokens"] as? Int32 ?? 2048

        isGenerating = true

        // TODO: Run inference in background
        // DispatchQueue.global(qos: .userInitiated).async {
        //     while self.isGenerating {
        //         // Generate tokens and send via sendEvent
        //     }
        // }

        print("LlamaEngine: Generating with temperature: \(temperature)")
        resolve(true)
    }

    @objc(stopGeneration:withRejecter:)
    func stopGeneration(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        isGenerating = false
        resolve(nil)
    }

    @objc(getRamUsage:withRejecter:)
    func getRamUsage(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let processInfo = ProcessInfo.processInfo
        let physicalMemory = processInfo.physicalMemory / (1024 * 1024)

        resolve([
            "used": 0,
            "total": Int(physicalMemory)
        ])
    }

    private func sendEvent(name: String, body: Any?) {
        self.sendEvent(withName: name, body: body)
    }
}
