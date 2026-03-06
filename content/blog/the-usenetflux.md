---
title: "The useNetFlux"
date: 2024-06-30T18:53:06+05:30
draft: false
toc: false
images:
tags:
  - TypeScript
  - State Mangement
  - Redux
  - NUXT
  - Pinia
  - API
  - Components
---

## A powerful utility library for managing API requests

### Project Links
[API Playground](https://netflux.nuxt.space/)
[GitHub](https://github.com/dh00mk3tu/usenetflux)

---

Jumping onto any new technology, framework or library to build apps etc is a challenge in itself. After a certain while, you hit the blocker that how do we make API calls in this environment; because naturally you have to consume data from the network at some point. Eventually you end up watching tutorials and reading documentation, but there is still no structure to it.

This composable helps to provide you with that structure.

I'm calling it a composable in general and not just in the terms of NUXT. It is a utility method for you that provides you a with very granular and precise control over your network calls.

I wanted to build a logic, or perhaps a wrapper around my API calls that will cancel a previous request and process a new one if the payload and the request endpoint aern't the same of even if they are same and we want to request new data.

I wanted to have this control in my hands. Each request gets into a stack, and if it's an async it's executed in parallel to the other requests; else if it's a sync reuest it get's checked if we should override it or not. 

I also wanted to cache the results, and take the headache of caching results from the hands of the developer, and let the developer focus on the fact that for long do they want to cache the results for, if they want to.

This will be a lot more technical and lot less theoretical, unlike my last blog. 

Though, again this project has been built with NUXT; but I plan to abstract it out as a normal JS/TS package adn test it out witht other frameworks as well. If you wish to help in this area or to contribute to this project - you're most welcome.  

useNetFlux also comes with a playground where you can test out the API calls and see how they behave. You can find the playground [here](https://netflux.nuxt.space/).


Let's understand the `override` logic.

---

_Understanding the `override` Flag in `useNetflux`_

The `override` flag in `useNetflux` provides control over how API requests; how should they behave when a similar request is already in progress. This flag is especially useful in scenarios where multiple requests might be triggered for the same endpoint, and you need to determine whether to wait for the existing request to complete or start a new one. Here's how the `override` flag can be used to manage both **asynchronous** and **synchronous** API calls:

### 1. Asynchronous Requests

When you make an asynchronous API request (using the `async` option), the ongoing request doesn't block the subsequent code execution, and the application can continue its operation. If another request to the same endpoint is initiated, the `override` flag determines whether the new request should cancel the ongoing one or let it continue.

- **With `override: true`:**

  - If a request is already being made to the same endpoint, it will **cancel the existing request** and make a new one.
  - This is useful when you don't want to wait for the existing request to finish and want to get fresh data immediately.

- **With `override: false`:**
  - If an existing request is already in progress, the new request will be **ignored**, and the original request will continue running.
  - This helps prevent redundant requests and waits for the first request's completion before initiating another one.

#### Example of Asynchronous Behavior

```ts
executeCall({
  apiRequest: {
    method: "GET",
    endpoint: "https://api.example.com/data",
  },
  async: true, // Non-blocking request
  override: true, // Cancel the ongoing request and make a new one
});
```

### 2. Synchronous Requests

For synchronous API requests, the application waits for the current request to complete before proceeding with the next steps. The `override` flag ensures proper behavior in this case too:

- **With `override: true`:**

  - Any ongoing request will be aborted, and the new one will take precedence. This is useful when you need the latest data immediately and are willing to sacrifice the in-progress request.

- **With `override: false`:**
  - The request will not be made if there’s already one in progress, ensuring that the same request is not made multiple times before completion.
  - This ensures efficient API usage and avoids sending unnecessary network requests when one is already underway.

#### Example of Synchronous Behavior

```ts
executeCall({
  apiRequest: {
    method: "GET",
    endpoint: "https://api.example.com/data",
  },
  async: false, // Block the execution until request completes
  override: false, // Wait for the ongoing request to finish
});
```

### Use Case Scenarios

- **Real-time data fetching**: When building real-time applications or features like search suggestions, you might want to use `override: true` with `async: true` to ensure that new data replaces outdated or stale requests. For example, in a search bar that triggers API requests as the user types, you might override the previous requests to avoid processing older results.

- **Non-urgent data**: For data that doesn't need to be updated frequently, such as fetching a user profile or initial page load, `override: false` ensures that redundant requests are avoided, saving bandwidth and preventing unnecessary server hits.

### TL;DR

- The `override` flag, when paired with `async` requests, gives flexibility to either cancel an ongoing request and fetch new data or reuse the in-progress request.
- In synchronous mode, `override` controls whether to block subsequent calls or proceed with a new request once the ongoing one is completed.

This flag is essential for optimizing API behavior in scenarios where multiple requests to the same endpoint could be triggered and helps manage network resources efficiently.

## Key Features

### 1. **Retries**

Automatically retry failed requests based on configurable settings.

- **Global Default**: 3 retries

- **Customizable**: Set retries and retry delay per request

- **Example**:

```ts
executeCall({
  apiRequest: {
    method: "GET",

    endpoint: "https://api.example.com/data",
  },

  retries: 5, // Retry up to 5 times

  retryDelay: 2000, // 2-second delay between retries
});
```

### 2. **Timeouts**

Set time limits on API requests to avoid indefinite waiting.

- **Global Default**: 5 seconds

- **Customizable**: Timeout can be set per request

- **Example**:

```ts
executeCall({
  apiRequest: {
    method: "POST",

    endpoint: "https://api.example.com/create",

    timeout: 10000, // 10-second timeout
  },
});
```

### 3. **Caching**

Cache responses for a specified duration to minimize redundant network calls.

- **Global Default**: Cached for 1 minute

- **Customizable**: Set `cacheDuration` per request

- **Skip Cache**: Force bypassing cache by setting `skipCache: true`

- **Example**:

```ts
executeCall({
  apiRequest: {
    method: "GET",

    endpoint: "https://api.example.com/data",
  },

  cacheDuration: 120000, // Cache for 2 minutes

  skipCache: false, // Enable cache by default
});
```

### 4. **Request Cancellation**

Abort ongoing requests using an `AbortController`.

- **Auto-Generated**: Timeout automatically triggers request cancellation

- **Custom**: Pass your own `AbortController` to manually cancel requests

- **Example**:

```ts
const controller = new AbortController();

executeCall({
  apiRequest: {
    method: "GET",

    endpoint: "https://api.example.com/data",
  },

  cancellationToken: controller,
});

// Cancel the request after 2 seconds

setTimeout(() => controller.abort(), 2000);
```

### 5. **Global Configuration**

Define global defaults for retries, timeouts, caching, and more.

- **Flexible**: Update default settings for all requests

- **Example**:

```ts
updateGlobalConfig({
  retries: 5, // Set global retries to 5

  timeout: 15000, // Set global timeout to 15 seconds

  logging: true, // Enable logging globally
});
```

### 6. **Logging**

Get real-time logging information about request behavior.

- **Global Setting**: Enable or disable logging in the global configuration

- **Log Levels**: `info`, `warn`, `error`

- **Example** log output:

```log

[INFO]: Starting API call { url: 'https://api.example.com/data', method: 'GET' }

[WARN]: Retrying... Attempt 2 { endpoint: 'https://api.example.com/data' }

[ERROR]: API call failed { endpoint: 'https://api.example.com/data', error: 'Timeout' }

```

## Methods

### `executeCall`

The core method to make API requests with enhanced features like retries, caching, timeouts, and logging.

```ts
async function executeCall({
  apiRequest,

  retries = 3,

  retryDelay = 1000,

  timeout = 5000,

  cacheDuration = 60000,

  skipCache = false,

  cancellationToken,

  async = false,

  override = false,
}: ExecuteCallParams): Promise<any>;
```

### `updateGlobalConfig`

Modify global configurations for all requests.

```ts
function updateGlobalConfig(
  newConfig: Partial<typeof defaultConfig.value>
): void;
```

### Example: Updating Global Config

```ts
updateGlobalConfig({
  retries: 4, // Update retries globally to 4

  cacheDuration: 300000, // Cache for 5 minutes
});
```

## API Request Structure

`apiRequest` object defines the structure of the API call, which includes the HTTP method, endpoint, headers, and body.

### Structure:

```ts
interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // HTTP method

  endpoint: string; // API endpoint

  headers?: Record<string, string>; // Optional headers

  queryParams?: Record<string, string | number>; // Optional query parameters

  body?: any; // Optional body for POST, PUT, etc.
}
```

### Example:

```ts
const apiRequest = {
  method: "POST",

  endpoint: "https://api.example.com/create",

  headers: {
    Authorization: "Bearer token",
  },

  body: {
    name: "New Item",

    description: "This is a new item",
  },
};
```

## Example Usage

### Simple GET Request

```ts
executeCall({
  apiRequest: {
    method: "GET",

    endpoint: "https://api.example.com/data",
  },
});
```

### POST Request with Retries and Timeout

```ts
executeCall({
  apiRequest: {
    method: "POST",

    endpoint: "https://api.example.com/create",

    body: { name: "New Item" },
  },

  retries: 5, // Retry up to 5 times

  retryDelay: 2000, // 2-second delay between retries

  timeout: 10000, // 10-second timeout
});
```

### Request with Custom Cancellation Token

```ts
const controller = new AbortController();

executeCall({
  apiRequest: {
    method: "GET",

    endpoint: "https://api.example.com/data",
  },

  cancellationToken: controller, // Use a custom token to cancel the request
});

// Cancel the request after 2 seconds

setTimeout(() => controller.abort(), 2000);
```

### Updating Global Configuration

```ts
updateGlobalConfig({
  retries: 2, // Update global retries to 2

  logging: true, // Enable logging globally
});
```

## GitHub

You can find the project [here](https://github.com/dh00mk3tu/usenetflux)
