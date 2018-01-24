import get from 'lodash.get';
import set from 'lodash.set';
import isEmpty from 'is-empty';
import { entriesHead } from './utils';

const has = x => !isEmpty(x);

export default class Entry {
  static slugField = 'name_slug';
  static cockpit = null;
  static schema = {};

  Map = new Map();

  defaultSchema = ['_by', '_created', '_id', '_mby', '_modified', '_order'];

  constructor(fields) {
    this.fields = fields;

    const { schema } = this.constructor;

    if (!this.fields) return;
    if (!schema && schema.fields) return;

    const slugFields = schema.fields
      .filter(({ options }) => options && options.slug)
      .map(({ name }) => ({ name: `${name}_slug` }));

    const possibleFields = [
      ...schema.fields,
      ...slugFields,
      ...this.defaultSchema.map(name => ({ name })),
    ];

    possibleFields.forEach(({ name }) => this.Map.set(name, this.fields[name]));
  }

  get(field, path) {
    if (path) return get(this.Map.get(field), path);

    return this.Map.get(field);
  }

  has(field, path) {
    if (path) {
      return has(this.Map.get(field), path);
    }

    return has(this.Map.get(field));
  }

  set(field, value, path) {
    if (path) {
      const sett = set(this.get(field), path, value);

      return this.Map.set(sett);
    }

    this.Map.set(field, value);

    return this;
  }

  setSlug(slug) {
    const { slugField } = this.constructor;

    this.set(slugField, slug);

    return this;
  }

  forEach(fn) {
    return this.Map.forEach(fn);
  }

  getImageField(field, options) {
    return this.constructor.cockpit.image(this.get(field, 'path'), options);
  }

  sync(options = {}) {
    const { slugField } = this.constructor;
    const filter = {
      [slugField]: this.get(slugField),
      ...(options.filter || {}),
    };

    const collection = this.constructor.cockpit.collection(
      this.constructor.schema.name,
      { ...options, filter },
    );

    return collection.promise.then(entriesHead).then(entry => {
      if (!entry) {
        console.warn(
          'No content found for the following query:',
          this.constructor.schema.name,
          filter,
        );
        return null;
      }

      this.Map = new this.constructor(entry).Map;

      return this;
    });
  }

  getCollection() {
    const filter = {};
    const { slugField } = this.constructor;

    if (slugField) filter[slugField] = this.get(slugField);
    if (this.has('_id')) filter._id = this.get('_id');

    return this.constructor.cockpit.collection(this.constructor.schema.name, {
      filter,
    });
  }

  watch(callback) {
    const collection = this.getCollection();

    collection.watch(entries => {
      this.Map = new this.constructor(entriesHead(entries)).Map;

      callback(this);
    });

    return this;
  }

  preview(callback) {
    const collection = this.getCollection();

    collection.on('preview', ({ data }) => {
      this.Map = new this.constructor(data).Map;

      callback(this);
    });
  }

  save() {
    return this.constructor.cockpit
      .collectionSave(this.constructor.schema.name, this.toObject())
      .then(entry => {
        if (!entry) {
          console.warn(
            'No content found for the following query:',
            this.constructor.schema.name,
            this.Map,
          );
          return null;
        }

        this.Map = new this.constructor(entry).Map;

        return this;
      });
  }

  toObject() {
    return [...this.Map].reduce(
      (prev, curr) => ({
        ...prev,
        [curr[0]]: curr[1],
      }),
      {},
    );
  }
}
