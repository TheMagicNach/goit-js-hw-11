import axios from 'axios';

export default class API {
  #URL = 'https://pixabay.com/api/';
  #KEY = '35948906-7430e6ea088e8a2a82f4e20ab';
  #page = 1;
  #per_page = 40;
  #search_query = '';

  LoadingMorePages() {
    this.#page += 1;
    return this.fetch();
  }

  loadNewPages(search) {
    this.#page = 1;
    this.#search_query = search.trim();
    return this.fetch();
  }

  async fetch() {
    const response = await axios.get(this.#URL, {
      params: {
        key: this.#KEY,
        q: this.#search_query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.#per_page,
        page: this.#page,
      },
    });
    return response.data;
  }
}