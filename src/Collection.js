import { entriesHead } from './utils';

export default class Collection {
  static slugField = 'name_slug';

  collectionName = '';
  cockpit = {};

  skip = 0;
  total = 0;
  lang = '';

  _getEntries = x => ({ entries }) => x(entries);
  _getData = x => ({ data }) => x(data);

  constructor({ Entry, cockpit, collectionName, ...options }) {
    this.options = {
      limit: this.limit,
      lang: this.lang,
      ...options,
    };

    this.collectionName = collectionName;
    this.cockpit = cockpit;
    this.Entry = Entry;

    this.collection = cockpit.collection(this.collectionName, this.options);
  }

  getFields() {
    return this.cockpit
      .collectionSchema(this.collectionName)
      .then(({ fields }) => fields);
  }

  getEntries(fields, extraOptions) {
    return this.cockpit
      .collectionGet(
        this.collectionName,
        this.getOptions({ ...extraOptions, fields }),
      )
      .then(({ entries }) => {
        console.log('entries: ', entries);
        return entries;
      });
  }

  fetch(fields, extraOptions) {
    return this.cockpit.collection(
      this.collectionName,
      this.getOptions({ ...extraOptions, fields }),
    );
  }

  getOneBySlug(slug, filters) {
    return entriesHead(
      this.cockpit.collection(this.collectionName, {
        ...this.options,
        filters: {
          [this.slugField]: slug,
          ...filters,
        },
      }),
    );
  }

  getOneByFieldSlug(field, slug, filters) {
    return entriesHead(
      this.cockpit.collection(this.collectionName, {
        ...this.options,
        filters: {
          [this.slugField]: slug,
          ...filters,
        },
      }),
    );
  }

  getObject(fields, extraOptions) {
    const fetch = this.fetch(fields, extraOptions);

    return {
      get: x => fetch.get(this._getEntries(x)),
      watch: x => fetch.watch(this._getEntries(x)),
      on: (event, x) => fetch.on(event, this._getData(x)),
    };
  }

  entities(fields, extraOptions) {
    const fetch = this.fetch(fields, extraOptions);

    return {
      get: x => fetch.get(this.mapEntries(x)),
      watch: x => fetch.watch(this.mapEntries(x)),
      on: (event, x) => fetch.on(event, this._getData(x)),
    };
  }

  mapEntries(x) {
    if (!this.Entry) {
      console.error(
        `You must specify a Entry class for this Collection: ${
          this.collectionName
        }`,
      );
    }

    return ({ entries }) => x(entries.map(e => new this.Entry(e)));
  }

  getOptions(extraOptions) {
    return {
      ...this.options,
      limit: this.limit,
      lang: this.lang,
      ...extraOptions,
    };
  }

  setLanguage(lang) {
    this.lang = lang;
  }

  getLanguage() {
    return this.lang;
  }
}
