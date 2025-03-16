import { API } from "../api";
import { ApiClient, ApiClientConfig, ApiExtensions, ApiSchema } from "./types";
import { getUrl } from "../utils";

export const createClient = <A extends API>(api: A, config: ApiClientConfig) : ApiClient<A> => {
  config.baseUrl = getUrl(config.baseUrl, api.config.prefix ?? '')
  const schema = api.schema;
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


// export const createApiClient = <A extends API>(api: A, config: ClientConfig) : ApiClient<A> => {
//   return createClient(api.schema, config) as any;
// }