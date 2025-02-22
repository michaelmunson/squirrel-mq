import { SchemaInput, SchemaType } from "../schema";
import { Client, ClientConfig } from "./types";
import { SnakeToCamelCaseObject } from "./utils";

const sanitizeBaseUrl = (baseUrl: string) => {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export const createClient = <T extends SchemaType<any>>(schema: SchemaInput, config: ClientConfig) : Client<{[K in keyof T]: SnakeToCamelCaseObject<T[K]>}> => {
  config.baseUrl = sanitizeBaseUrl(config.baseUrl);
  const client:Client<{[K in keyof T]: SnakeToCamelCaseObject<T[K]>}> = {} as any;
  for (const key in schema) {
    client[key as keyof T] = {
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