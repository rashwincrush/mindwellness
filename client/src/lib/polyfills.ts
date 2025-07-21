// Browser polyfills for Node.js dependencies
import { Buffer } from 'buffer';

// Make Buffer and process available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  (window as any).process = { env: {} };
}