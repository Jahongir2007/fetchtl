// fetchtl.js
// Author: Jahongir Sobirov (c) 2025
// Version: 0.0.1
// Description: Tiny library to send GET and POST requests using HTML attributes ($get, $post)
// License: MIT

class FetchTL {
  static init() {
    // Base URL from <html $url> or fallback
    this.baseURL = document.documentElement.getAttribute("$url") || window.location.origin;

    this.handleGetElements();
    this.handlePost();
    this.handlePut();
    this.handleDelete();
    this.handlePatch();
    this.handlePolling();
    this.handleRealtimeElements();

     // Observe new DOM elements added dynamically
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if(node.nodeType !== 1) return; // element only
          if(node.hasAttribute && node.hasAttribute("$get")) {
            this.fetchAndUpdate(node, node.getAttribute("$get"));
          }
          if(node.querySelectorAll) {
            node.querySelectorAll("[\\$get]").forEach(el => {
              this.fetchAndUpdate(el, el.getAttribute("$get"));
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- $get elements
  static async handleGetElements() {
    const elements = document.querySelectorAll("[\\$get]");
    for (const el of elements) {
      await this.fetchAndUpdate(el, el.getAttribute("$get"));
    }
  }

  // --- Forms with $post, $put, $delete + $map + validation + $single-fetch + $syncform
static async handlePost() {
  const form = document.querySelector(`form[\\$post]`);
  if (!form) return null;

  const sendOn = form.getAttribute('$send-on') || 'submit';
  const reload = form.getAttribute('$reload') ?? 'true';          // default: reload page
  const singleFetch = form.getAttribute('$single-fetch') ?? 'false'; // default: allow multiple fetches
  let isFetching = false;

     form.addEventListener(sendOn, async (e) => {
      
      if (reload === 'false') e.preventDefault(); // stop reload

      let url = form.getAttribute('$post');
      if (!url) return;

      if (url.startsWith('/')) url = this.baseURL + url;

      // const data = Object.fromEntries(new FormData(form).entries());

      const data = {};

    form.querySelectorAll("input, textarea, select").forEach(input => {
      // Collect classes
      const classes = Array.from(input.classList);

      // Save by id
      if (input.id) {
        data[`#${input.id}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by name
      if (input.name) {
        data[input.name] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by first class as key if it exists
      if (input.classList.length > 0) {
        data[`.${input.classList[0]}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }
    });

    // return data;

    if(singleFetch === 'true' && isFetching) return;
    isFetching = true;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Emit success event
        form.dispatchEvent(new CustomEvent("fetchtl:success", { detail: data }));

        console.log("Sent JSON:", data);
      } catch (err) {
        // Emit error event
        form.dispatchEvent(new CustomEvent("fetchtl:error", { detail: err }));
      }finally {
        // This always runs, success or error
        isFetching = false;
      }
    });

}

static async handlePut() {
  const form = document.querySelector(`form[\\$put]`);
  if (!form) return null;

  const sendOn = form.getAttribute('$send-on') || 'submit';
  const reload = form.getAttribute('$reload') ?? 'true';          // default: reload page
  const singleFetch = form.getAttribute('$single-fetch') ?? 'false'; // default: allow multiple fetches
  let isFetching = false;

     form.addEventListener(sendOn, async (e) => {
      
      if (reload === 'false') e.preventDefault(); // stop reload

      let url = form.getAttribute('$put');
      if (!url) return;

      if (url.startsWith('/')) url = this.baseURL + url;

      // const data = Object.fromEntries(new FormData(form).entries());

      const data = {};

    form.querySelectorAll("input, textarea, select").forEach(input => {
      // Collect classes
      const classes = Array.from(input.classList);

      // Save by id
      if (input.id) {
        data[`#${input.id}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by name
      if (input.name) {
        data[input.name] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by first class as key if it exists
      if (input.classList.length > 0) {
        data[`.${input.classList[0]}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }
    });

    // return data;

    if(singleFetch === 'true' && isFetching) return;
    isFetching = true;
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Emit success event
        form.dispatchEvent(new CustomEvent("fetchtl:success", { detail: data }));

        console.log("Sent JSON:", data);
      } catch (err) {
        // Emit error event
        form.dispatchEvent(new CustomEvent("fetchtl:error", { detail: err }));
      }finally {
        // This always runs, success or error
        isFetching = false;
      }
    });

}

static async handlePatch() {
  const form = document.querySelector(`form[\\$patch]`);
  if (!form) return null;

  const sendOn = form.getAttribute('$send-on') || 'submit';
  const reload = form.getAttribute('$reload') ?? 'true';          // default: reload page
  const singleFetch = form.getAttribute('$single-fetch') ?? 'false'; // default: allow multiple fetches
  let isFetching = false;

     form.addEventListener(sendOn, async (e) => {
      
      if (reload === 'false') e.preventDefault(); // stop reload

      let url = form.getAttribute('$patch');
      if (!url) return;

      if (url.startsWith('/')) url = this.baseURL + url;

      // const data = Object.fromEntries(new FormData(form).entries());

      const data = {};

    form.querySelectorAll("input, textarea, select").forEach(input => {
      // Collect classes
      const classes = Array.from(input.classList);

      // Save by id
      if (input.id) {
        data[`#${input.id}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by name
      if (input.name) {
        data[input.name] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by first class as key if it exists
      if (input.classList.length > 0) {
        data[`.${input.classList[0]}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }
    });

    // return data;

    if(singleFetch === 'true' && isFetching) return;
    isFetching = true;
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Emit success event
        form.dispatchEvent(new CustomEvent("fetchtl:success", { detail: data }));

        console.log("Sent JSON:", data);
      } catch (err) {
        // Emit error event
        form.dispatchEvent(new CustomEvent("fetchtl:error", { detail: err }));
      }finally {
        // This always runs, success or error
        isFetching = false;
      }
    });

}

static async handleDelete() {
  const form = document.querySelector(`form[\\$delete]`);
  if (!form) return null;

  const sendOn = form.getAttribute('$send-on') || 'submit';
  const reload = form.getAttribute('$reload') ?? 'true';          // default: reload page
  const singleFetch = form.getAttribute('$single-fetch') ?? 'false'; // default: allow multiple fetches
  let isFetching = false;

     form.addEventListener(sendOn, async (e) => {
      
      if (reload === 'false') e.preventDefault(); // stop reload

      let url = form.getAttribute('$delete');
      if (!url) return;

      if (url.startsWith('/')) url = this.baseURL + url;

      // const data = Object.fromEntries(new FormData(form).entries());

      const data = {};

    form.querySelectorAll("input, textarea, select").forEach(input => {
      // Collect classes
      const classes = Array.from(input.classList);

      // Save by id
      if (input.id) {
        data[`#${input.id}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by name
      if (input.name) {
        data[input.name] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }

      // Save by first class as key if it exists
      if (input.classList.length > 0) {
        data[`.${input.classList[0]}`] = {
          value: input.value,
          classes,
          name: input.name || null
        };
      }
    });

    // return data;

    if(singleFetch === 'true' && isFetching) return;
    isFetching = true;
      try {
        const res = await fetch(url, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Emit success event
        form.dispatchEvent(new CustomEvent("fetchtl:success", { detail: data }));

        console.log("Sent JSON:", data);
      } catch (err) {
        // Emit error event
        form.dispatchEvent(new CustomEvent("fetchtl:error", { detail: err }));
      }finally {
        // This always runs, success or error
        isFetching = false;
      }
    });

}


  // --- Polling support ($poll)
  static handlePolling() {
    const pollElements = document.querySelectorAll("[\\$poll]");
    
    pollElements.forEach(el => {
      const interval = parseInt(el.getAttribute("$poll"));
      if (isNaN(interval) || interval <= 0) return;

      // Save original template
      const template = el.innerHTML;

      setInterval(async () => {
        let url = el.getAttribute("$get");
        if (!url) return;

        const cacheBuster = "_=" + new Date().getTime();
        url += url.includes("?") ? "&" + cacheBuster : "?" + cacheBuster;

        if (url.startsWith("/")) url = this.baseURL + url;

        try {
          const res = await fetch(url);
          const data = await res.json();

          // Always render from the original template
          el.innerHTML = this.renderString(template, data);

        } catch(err) {
          console.error("Polling error:", err);
        }
      }, interval);
    });
  }



  // --- $realtime WebSocket support
  static handleRealtimeElements() {
    const elements = document.querySelectorAll("[\\$realtime]");
    elements.forEach(el => {
      const url = el.getAttribute("$realtime");
      if(!url) return;
      const wsUrl = url.startsWith("/") ? this.baseURL.replace(/^http/, "ws") + url : url;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (msg) => {
        let data;
        try { data = JSON.parse(msg.data); } catch { data = msg.data; }
        this.renderTemplate(el, data);
        el.dispatchEvent(new CustomEvent("fetchtl:message", { detail: data }));
      };
    });
  }

  // --- Fetch JSON and render template
  static async fetchAndUpdate(el, url) {
    if(url.startsWith("/")) url = this.baseURL + url;

    try {
      const res = await fetch(url);
      const data = await res.json();
      this.renderTemplate(el, data);
      el.dispatchEvent(new CustomEvent("fetchtl:success", { detail: data }));
    } catch(err) {
      el.innerText = "⚠️ Error fetching: " + err.message;
      el.dispatchEvent(new CustomEvent("fetchtl:error", { detail: err }));
    }
  }

  // --- Template replacement ($variable support)
  static renderTemplate(el, data) {
    if(typeof el === "string") return this.renderString(el, data);

    // // Replace in text nodes
    // el.childNodes.forEach(node => {
    //   if(node.nodeType === 3) { // text node
    //     node.textContent = this.renderString(node.textContent, data);
    //   }
    // });

    // Top-level innerHTML
    el.innerHTML = this.renderString(el.innerHTML, data);
  }

  static renderString(template, data) {
    return template.replace(/\$([a-zA-Z0-9_.]+)/g, (match, key) => {
      const keys = key.split(".");
      let val = data;
      for(const k of keys) {
        if(val && k in val) val = val[k];
        else return match;
      }
      return val;
    });
  }

  // --- Form validation
  static validateForm(formEl) {
    const errors = {};
    const inputs = formEl.querySelectorAll("input, textarea, select");

    inputs.forEach(input => {
      const value = input.value.trim();
      const name = input.name || input.id || "unknown";

      if(input.hasAttribute("$required") && !value) {
        errors[name] = "This field is required";
      }

      if(input.hasAttribute("$email") && value) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if(!emailRegex.test(value)) errors[name] = "Invalid email address";
      }

      const min = input.getAttribute("$min");
      if(min && value.length < parseInt(min)) errors[name] = `Minimum length is ${min}`;

      const max = input.getAttribute("$max");
      if(max && value.length > parseInt(max)) errors[name] = `Maximum length is ${max}`;
    });

    return errors;
  }

}

// --- Auto-init on DOM ready
document.addEventListener("DOMContentLoaded", () => FetchTL.init());
