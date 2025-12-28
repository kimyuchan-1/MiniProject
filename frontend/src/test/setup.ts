// Test setup file for vitest
import { vi } from 'vitest'

// Mock window.L for Leaflet tests
Object.defineProperty(window, 'L', {
  value: {
    heatLayer: vi.fn(),
  },
  writable: true,
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}