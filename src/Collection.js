import { arrayHead, entriesHead } from './utils';

export default class Collection {
  static collectionName = '';
  static slugField = 'name_slug';

  cockpit = {};

  skip = 0;
  total = 0;
  lang = '';

  _getEntries = x => ({ entries }) => x(entries);
  _getData = x => ({ data }) => x(data);

  constructor({ Entry, cockpit, ...options }) {
    this.options = {
      limit: this.limit,
      lang: this.lang,
      ...options,
    };

    this.cockpit = cockpit;
    this.Entry = Entry;

    const { collectionName } = this.constructor;

    if (!collectionName)
      return console.error(
        'You must specify a static collectionName property on %s class',
        this.constructor.name,
      );

    this.collection = cockpit.collection(collectionName, this.options);
  }

  getFields() {
    return this.cockpit
      .collectionSchema(this.constructor.collectionName)
      .then(({ fields }) => fields);
  }

  getEntries(fields, extraOptions) {
    return this.cockpit
      .collectionGet(
        this.constructor.collectionName,
        this.getOptions({ ...extraOptions, fields }),
      )
      .then(({ entries }) => {
        console.log('entries: ', entries);
        return entries;
      });
  }

  fetch(fields, extraOptions) {
    return this.cockpit.collection(
      this.constructor.collectionName,
      // TODO check fields vs filter.
      this.getOptions({ ...extraOptions, fields }),
    );
  }

  getOneBySlug(slug, fields, extraOptions) {
    const fetch = this.fetch(fields, extraOptions);

    return {
      promise: this.fetch(fields, {
        filter: {
          [this.constructor.slugField]: slug,
        },
        ...extraOptions,
      }).promise.then(entriesHead),
      get: x => fetch.get(arrayHead(this._getEntries(x))),
      watch: x => fetch.watch(arrayHead(this._getEntries(x))),
      on: (event, x) => fetch.on(event, arrayHead(this._getData(x))),
    };
  }

  getObject(fields, extraOptions) {
    const fetch = this.fetch(fields, extraOptions);

    return {
      promise: fetch.promise.then(this._getEntries(x => x)),
      get: x => fetch.get(this._getEntries(x)),
      watch: x => fetch.watch(this._getEntries(x)),
      on: (event, x) => fetch.on(event, this._getData(x)),
    };
  }

  entities(fields, extraOptions) {
    const fetch = this.fetch(fields, extraOptions);

    return {
      promise: fetch.get(this.mapEntries(x => x)),
      get: x => fetch.get(this.mapEntries(x)),
      watch: x => fetch.watch(this.mapEntries(x)),
      on: (event, x) => fetch.on(event, this._getData(x)),
    };
  }

  mapEntries(x) {
    if (!this.Entry) {
      console.error(
        `You must specify a Entry class for this Collection: ${
          this.constructor.collectionName
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
