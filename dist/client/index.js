// src/utils/utils.ts
var getUrl = (...paths) => {
  const url = paths.map(
    (p) => p.trim()
  ).filter(Boolean).map((p) => p.startsWith("/") ? p.slice(1) : p).map((p) => p.endsWith("/") ? p.slice(0, -1) : p).join("/");
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

// src/client/client.ts
var createClient = (schema, config) => {
  config.baseUrl = getUrl(config.baseUrl);
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
export {
  createClient
};
//# sourceMappingURL=index.js.map