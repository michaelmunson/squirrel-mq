"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  createClient: () => createClient
});
module.exports = __toCommonJS(client_exports);

// src/utils/utils.ts
var getUrl = (...paths) => {
  const url = paths.map(
    (p) => p.trim()
  ).filter(Boolean).map((p) => p.startsWith("/") ? p.slice(1) : p).map((p) => p.endsWith("/") ? p.slice(0, -1) : p).join("/");
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

// src/client/client.ts
var createClient = (api, config) => {
  config.baseUrl = getUrl(config.baseUrl, api.config.prefix ?? "");
  const schema = api.schema;
  const client = {
    models: {},
    custom: (route) => ({
      get: () => fetch(getUrl(route, config.baseUrl), {
        method: "GET",
        headers: config.headers
      }).then((res) => res.json()),
      post: (data) => fetch(getUrl(route, config.baseUrl), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.headers
        },
        body: JSON.stringify(data)
      }).then((res) => res.json()),
      patch: (data) => fetch(getUrl(route, config.baseUrl), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...config.headers
        },
        body: JSON.stringify(data)
      }).then((res) => res.json()),
      delete: () => fetch(getUrl(route, config.baseUrl), {
        method: "DELETE"
      }).then((res) => res.json()),
      put: (data) => fetch(getUrl(route, config.baseUrl), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...config.headers
        },
        body: JSON.stringify(data)
      }).then((res) => res.json())
    })
  };
  for (const key in schema) {
    client.models[key] = {
      get(id) {
        const url = `${config.baseUrl}/${key}/${id}`;
        return fetch(url, {
          headers: config.headers
        }).then((res) => res.json());
      },
      list(params) {
        let url = `${config.baseUrl}/${key}`;
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.filter) searchParams.set("filter", JSON.stringify(params.filter));
        if (searchParams.size) url += `?${searchParams.toString()}`;
        return fetch(url, {
          headers: config.headers,
          method: "GET"
        }).then((res) => res.json());
      },
      create(data) {
        return fetch(`${config.baseUrl}/${key}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...config.headers
          },
          body: JSON.stringify(data)
        }).then((res) => res.json());
      },
      update(id, data) {
        return fetch(`${config.baseUrl}/${key}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...config.headers
          },
          body: JSON.stringify(data)
        }).then((res) => res.json());
      },
      delete(id) {
        return fetch(`${config.baseUrl}/${key}/${id}`, {
          method: "DELETE"
        }).then((res) => res.json());
      }
    };
  }
  return client;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createClient
});
//# sourceMappingURL=index.cjs.map