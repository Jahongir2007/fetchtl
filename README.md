# FetchTL

A **lightweight library to fetch data using only HTML—no frontend JavaScript needed**.

---

## Description

Fetchtl allows you to fetch data and interact with your server using only HTML. It simplifies HTTP requests, JSON parsing, and error handling, making it perfect for developers who want minimal JS-free solutions or to experiment with server-driven UIs.

---

## Features
- Fetch data directly with HTML—no frontend JS required  
- Lightweight and minimal dependency footprint  
- Simplified GET, POST, PUT, DELETE requests  
- Automatic JSON parsing and error handling  
- Works seamlessly with server-driven interfaces  
---

## Installation (for backend)

```bash
# Using npm
npm install fetchtl
```
## Importing (for frontend)
```html
<script src="https://cdn.jsdelivr.net/gh/jahongir2007/fetchtl/fetchtl.js"></script>
```
## Fetchtl Frontend API Guide

Fetchtl is a lightweight HTML-first library to fetch data from your server without writing frontend JavaScript. It uses custom HTML attributes (`$get`, `$post`, `$put`, `$delete`, `$patch`, `$poll`, `$realtime`) to handle HTTP requests, form submissions, polling, and real-time updates.

### Table of Contents
#### For frontend
 - [`$get`: Fetch and render](https://github.com/Jahongir2007/fetchtl/blob/main/README.md#get-fetch-and-render)
 - [`$post`, `$put`, `$patch`, `$delete`: Forms](https://github.com/Jahongir2007/fetchtl/blob/main/README.md#post-put-patch-delete-forms)
 - [`$poll`: Automatic polling](https://github.com/Jahongir2007/fetchtl/blob/main/README.md#realtime-websocket-updates))
 - [`$realtime`: WebSocket updates](https://github.com/Jahongir2007/fetchtl/blob/main/README.md#realtime-websocket-updates)
 - [Template Variables]()
 - [Form Validation]()
#### For backend
 - [Syncing Data]()
 - [Reading and Writing Input Values]()
 - [Selectors]()
 - [Example Usage]()

### `$get`: Fetch and render
Use `$get` on any HTML element to automatically fetch JSON from a URL and render it inside the element.
```html
<div $get="/api/user">
  <p>Name: $name</p>
  <p>Email: $email</p>
</div>
```
 - Fetchtl will replace `$name`, `$email` with the JSON response.
 - Works on dynamically added elements thanks to `MutationObserver`.

### `$post`, `$put`, `$patch`, `$delete`: Forms
Fetchtl automatically handles forms with `$post`, `$put`, `$patch`, or `$delete`.
```html
<form $post="/api/submit" $send-on="submit" $reload="false" $single-fetch="true">
  <input type="text" name="username" $required />
  <input type="email" name="email" $required $email />
  <button type="submit">Send</button>
</form>
```
#### Features
 - `$send-on`: Event to trigger submission (default: submit)
 - `$reload`: Reload page after submit? "true" by default
 - `$single-fetch`: Prevent multiple submissions at the same time
#### Custom Events
 - `fetchtl:success` → Fired after successful submission
 - `fetchtl:error` → Fired on error

```js
const form = document.querySelector('form[$post]');
form.addEventListener('fetchtl:success', e => console.log("Success:", e.detail));
form.addEventListener('fetchtl:error', e => console.log("Error:", e.detail));
```

### `$poll`: Automatic polling
Poll a URL every X milliseconds and update the element.
```html
<div $get="/api/status" $poll="5000">
  <p>Status: $status</p>
</div>
```
 - `$poll="5000"` → fetch every 5000ms (5 seconds)
 - Template is re-rendered every poll cycle

### `$realtime`: WebSocket updates
Receive real-time JSON updates via WebSocket.
```html
<div $realtime="/ws/updates">
  <p>Message: $message</p>
</div>
```
 - Sends events as `fetchtl:message` with the data
 - Auto-renders template variables
```js
const el = document.querySelector('[\\$realtime]');
el.addEventListener('fetchtl:message', e => console.log("New message:", e.detail));
```

### Template Variables
Fetchtl supports `$variable` syntax inside HTML:
```html
<p>Hello, $user.name!</p>
<p>Your balance: $account.balance</p>
```
 - Nested properties supported: `$user.name`, `$account.balance`
 - If key is missing, it will leave the variable untouched

### Form Validation
Add simple validation attributes to inputs:
```html
<input type="text" name="username" $required $min="3" $max="15" />
<input type="email" name="email" $required $email />
```
 - `$required`: Field must not be empty
 - `$email`: Must be valid email format
 - `$min / $max`: Minimum / maximum string length
Validate in JS:
```js
const formEl = document.querySelector('form');
const errors = FetchTL.validateForm(formEl);
console.log(errors); // { username: "Minimum length is 3" }
```

## Fetchtl Backend API
Fetchtl is a mini-DOM store for managing form/input data on the server. It works seamlessly with Express, allowing you to sync with `req.body`.
### Initilization
Import in your Express app:
```js
const express = require("express");
const $ = require("fetchtl");

const app = express();
app.use(express.json()); // parse JSON bodies
```

### Syncing `req.body` Automatically
In your route handlers, just call `$.sync(req.body)`:
```js
app.post("/submit", (req, res) => {
  // Sync all form data into $
  $.sync(req.body);

  // Access values via $.input
  const username = $.input("username").val(); // array
  const age = $.input("#age").val();          // string

  console.log("Backend store:", $.store);

  res.json({
    message: "Form data synced successfully",
    username,
    age
  });
});
```

### Reading and Writing Input Values
```js
// GET value by ID
const age = $.input("#age").val();

// GET values by class
const emails = $.input(".email").val();

// GET values by name
const usernames = $.input("username").val();

// SET values by ID, class, or name
$.input("#age").val("19");
$.input(".email").val("new@mail.com");
$.input("username").val("John");
```
 - **IDs** → single string
 - **Classes / Names** → arrays
 - Setting values updates the internal `$` store

### Example Express + Fetchtl Integration
```js
const express = require("express");
const $ = require("fetchtl");

const app = express();
app.use(express.json());

app.post("/api/form", (req, res) => {
  $.sync(req.body); // sync form data

  // Access some values
  const username = $.input("username").val()[0]; // first value
  const age = $.input("#age").val();

  console.log("Synced $ store:", $.store);

  res.json({
    status: "success",
    data: { username, age }
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

### Notes
 - `$` is designed for server-driven HTML / JS-free forms.
 - Works perfectly with fetchtl frontend: `$post`, `$put`, `$patch`, `$delete` attributes.
 - Syncing `req.body` is as simple as calling `$.sync(req.body)` in any route.
 - After sync, use `$.input(selector).val()` to get or set values.
