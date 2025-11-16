// fetchtl-backend.js
// Author: Jahongir Sobirov (c) 2025
// Version: 0.0.2
// Description: Improved mini-DOM backend for Fetchtl
// License: MIT

class FetchTLBackend {
  constructor() {
    this.store = {}; // { id: { value, name, classes } }
  }

  sync(data) {
  // If data is the new flat format:
  // { "#age": "18", ".email": "test@gmail.com", "username": "Jahongir" }
  if (typeof data === "object" && !Array.isArray(data)) {

    Object.entries(data).forEach(([key, val]) => {
      // val is already { value: ..., classes: [...] } from parser
      this.store[key] = val;
    });

    return;
  }

  console.warn("No recognizable data to sync:", data);
}

  input(selector) {
    return {
      val: (v) => {
        // ---- SET ----
        if (v !== undefined) {
          Object.entries(this.store).forEach(([key, obj]) => {
            if (
              key === selector ||
              obj.name === selector ||
              key === `#${selector}` ||
              key === `.${selector}`
            ) {
              obj.value = v;
            }
          });
          return v;
        }

        // ---- GET ----
        if (selector.startsWith("#")) {
          // Return single value for ID
          const obj = this.store[selector] || this.store[`#${selector}`];
          return obj?.value ?? null;
        }

        if (selector.startsWith(".")) {
          const className = selector.slice(1);
          return Object.values(this.store)
            .filter(obj => obj.classes?.includes(className))
            .map(obj => obj.value);
        }

        // Name selector → array of values
        return Object.values(this.store)
          .filter(obj => obj.name === selector)
          .map(obj => obj.value);
      }
    };
  }
}

module.exports = new FetchTLBackend();
