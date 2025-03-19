import { API, APIConfig, ApiExtensionFunction } from "../api";
import { ApiClient, ApiClientConfig, ApiExtensions, ApiSchema } from "./types";
import { getUrl } from "../utils";
import { SchemaInput, SchemaType } from "../schema";

/**
 * @description 
 * Create a frontend client for the API, allowing easy access to the API's models and custom routes.
 * @example
 * ```ts
  import { createClient } from "squirrelify/client";
  import { extensions, config} from "./api";
  import { schema } from "./schema";

  const client = createClient({schema, extensions, config}, {
    baseUrl: 'http://localhost:3000/',
    headers: {
      'Authorization': 'Bearer 1234567890',
    }
  });

  client.models.posts.get('abc-12').then(r => console.log(r));

  client.custom('example-users').post({
    age: 20,
    name: 'John Doe',
    email: 'john.doe@example.com',
    id: 'abc-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).then(r => console.log(r));
  ```
 */
export const createClient = <A extends API>(schema:SchemaInput, config:ApiClientConfig) : ApiClient<A> => {
  config.baseUrl = getUrl(config.baseUrl)
  const client:ApiClient<A> = {
    models: {},
    custom: (route:keyof ApiExtensions<A>) => ({
      get: () => fetch(getUrl(route as string, config.baseUrl), {
        method: 'GET',
        headers: config.headers,
      }).then(res => res.json()),
      post: (data:any) => fetch(getUrl(route as string, config.baseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),
      patch: (data:any) => fetch(getUrl(route as string, config.baseUrl), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),
      delete: () => fetch(getUrl(route as string, config.baseUrl), {
        method: 'DELETE',
      }).then(res => res.json()),
      put: (data:any) => fetch(getUrl(route as string, config.baseUrl), {
        method: 'PUT',
        headers: {  
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    })
  } as any;

  for (const key in schema) {
    client.models[key as keyof ApiSchema<A>] = {
      get(id) {
        const url = `${config.baseUrl}/${key as string}/${id}`;
        return fetch(url, {
          headers: config.headers,
        }).then(res => res.json());
      },
      list(params) {
        let url = `${config.baseUrl}/${key as string}`;
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', params.page.toString());
        if (params.limit) searchParams.set('limit', params.limit.toString());
        if (params.filter) searchParams.set('filter', JSON.stringify(params.filter));
        if (searchParams.size) url += `?${searchParams.toString()}`;
        return fetch(url, {
          headers: config.headers,
          method: 'GET'
        }).then(res => res.json()); 
      },
      create(data) {
        return fetch(`${config.baseUrl}/${key as string}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify(data),
        }).then(res => res.json());
      },
      update(id, data) {
        return fetch(`${config.baseUrl}/${key as string}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify(data),
        }).then(res => res.json())  ;
      },
      delete(id) {
        return fetch(`${config.baseUrl}/${key as string}/${id}`, {  
          method: 'DELETE',
        }).then(res => res.json());
      },
    } 
  }
  return client;
}
