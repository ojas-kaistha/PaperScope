import os
import torch
import onnxruntime as ort
from optimum.onnxruntime import ORTModelForCausalLM
from transformers import AutoTokenizer

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MODEL_DIR = os.path.join(BASE_DIR, "backend", "models", "qwen2.5-1.5b-onnx")


class LocalONNXLLM:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.active_provider = "CPUExecutionProvider"
        self.device_info = "Multi-Core CPU (AVX2)"

    def _ensure_loaded(self):
        if self.model is None or self.tokenizer is None:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(
                    f"Model directory not found at: {self.model_path}"
                )

            print(f"[PaperScope] Loading local tokenizer from: {self.model_path}")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                local_files_only=True
            )

            # High-performance multi-threaded ONNX session configuration
            session_opts = ort.SessionOptions()
            cpu_threads = min(8, os.cpu_count() or 4)
            session_opts.intra_op_num_threads = cpu_threads
            session_opts.inter_op_num_threads = 2
            session_opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

            available_providers = ort.get_available_providers()
            print(f"[PaperScope] Available hardware execution providers: {available_providers}")

            # Hybrid GPU (DirectML) + Multi-Core CPU (AVX2) Load Distribution
            if "DmlExecutionProvider" in available_providers:
                try:
                    print(f"[PaperScope] Distributing model workload across GPU (DirectML) and {cpu_threads} CPU AVX2 threads...")
                    self.model = ORTModelForCausalLM.from_pretrained(
                        self.model_path,
                        subfolder="onnx",
                        file_name="model_q4.onnx",
                        provider="DmlExecutionProvider",
                        session_options=session_opts,
                        local_files_only=True
                    )
                    self.active_provider = "DmlExecutionProvider"
                    self.device_info = f"Hybrid GPU (DirectML) + {cpu_threads}-thread CPU (AVX2)"
                    print(f"[PaperScope] Active Engine: {self.device_info}")
                    return
                except Exception as e:
                    print(f"[PaperScope] DirectML setup notice: {e}. Switching to CPU fallback...")

            # Fallback to pure CPU
            print(f"[PaperScope] Initializing 4-bit ONNX model on {cpu_threads} CPU AVX2 worker threads...")
            self.model = ORTModelForCausalLM.from_pretrained(
                self.model_path,
                subfolder="onnx",
                file_name="model_q4.onnx",
                provider="CPUExecutionProvider",
                session_options=session_opts,
                local_files_only=True
            )
            self.active_provider = "CPUExecutionProvider"
            self.device_info = f"{cpu_threads}-thread CPU (AVX2)"
            print(f"[PaperScope] Active Engine: {self.device_info}")

    def generate(self, prompt: str, max_new_tokens: int = 260, temperature: float = 0.0) -> str:
        self._ensure_loaded()
        inputs = self.tokenizer(prompt, return_tensors="pt")
        input_len = inputs.input_ids.shape[1]

        generate_kwargs = {
            "max_new_tokens": max_new_tokens,
            "pad_token_id": self.tokenizer.eos_token_id,
            "repetition_penalty": 1.12,
            "do_sample": False if temperature == 0.0 else True,
        }

        if temperature > 0.0:
            generate_kwargs["temperature"] = temperature
            generate_kwargs["top_p"] = 0.9

        with torch.no_grad():
            outputs = self.model.generate(**inputs, **generate_kwargs)

        generated_ids = outputs[0][input_len:]
        return self.tokenizer.decode(generated_ids, skip_special_tokens=True).strip()


local_llm = LocalONNXLLM(MODEL_DIR)
