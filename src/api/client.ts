import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://6afd66602a9c141d36b874a0.mockapi.io',
});