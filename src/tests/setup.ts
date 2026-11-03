import { vi } from "vitest";

// Mock de onnxruntime-web para tests
vi.mock("onnxruntime-web", () => ({
  InferenceSession: {
    create: vi.fn().mockResolvedValue({
      run: vi.fn().mockResolvedValue({
        output: { data: new Float32Array([0.1, 0.2, 0.1, 0.1, 0.1]) },
      }),
    }),
  },
}));
