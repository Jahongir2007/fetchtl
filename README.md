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

## Installation

```bash
# Using npm
npm install fetchtl
```
## Fetchtl Frontend API Guide

Fetchtl is a lightweight HTML-first library to fetch data from your server without writing frontend JavaScript. It uses custom HTML attributes (`$get`, `$post`, `$put`, `$delete`, `$patch`, `$poll`, `$realtime`) to handle HTTP requests, form submissions, polling, and real-time updates.

### Table of Contents
 - [`$get`: Fetch and render]()
 - [`$post`, `$put`, `$patch`, `$delete`: Forms]()
 - [`$poll`: Automatic polling]()
 - [`$realtime`: WebSocket updates]()
 - [Template Variables]()
 - [Form Validation]()


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
