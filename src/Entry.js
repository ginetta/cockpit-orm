import get from 'lodash.get';
import set from 'lodash.set';
import isEmpty from 'is-empty';
import { entriesHead } from './utils';

const has = x => !isEmpty(x);

export default class Entry {
  static slugField = 'name_slug';

  Map = new Map();

  defaultSchema = ['_by', '_created', '_id', '_mby', '_modified', '_order'];

  constructor({ cockpit, schema, fields }) {
    this.cockpit = cockpit;
    this.fields = fields;
    this.schema = schema;

    if (!this.fields) return;
    if (!this.schema) return;

    const slugFields = this.schema.fields
      .filter(({ options }) => options && options.slug)
      .map(({ name }) => ({ name: `${name}_slug` }));

    const possibleFields = [
      ...schema.fields,
      ...slugFields,
      ...this.defaultSchema.map(name => ({ name })),
    ];

    possibleFields.forEach(({ name }) => {
      this.Map.set(name, this.fields[name]);
    });
  }

  get(field, path) {
    if (path) {
      return get(this.Map.get(field), path);
    }

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
    return this.cockpit.image(this.get(field, 'path'), options);
  }

  sync() {
    const { slugField } = this.constructor;
    const filter = { [slugField]: this.get(slugField) };

    const collection = this.cockpit.collection(
      this.constructor.collectionName,
      { filter },
    );

    return collection.promise.then(entriesHead).then(entry => {
      this.Map = new this.constructor(entry).Map;

      return this;
    });
  }

  getCollection() {
    const filter = {};
    const { slugField } = this.constructor;

    if (slugField) filter[slugField] = this.get(slugField);
    if (this.has('_id')) filter._id = this.get('_id');

    return this.cockpit.collection(this.constructor.collectionName, { filter });
  }

  watch(callback) {
    const collection = this.getCollection();

    collection.watch(entry => {
      this.Map = new this.constructor(entriesHead(entry)).Map;

      callback(this);
    });

    collection.on('preview', entry => {
      this.Map = new this.constructor(entry.data).Map;

      callback(this);
    });

    return this;
  }

  save() {
    return this.cockpit.collectionSave(
      this.constructor.collectionName,
      this.toObject(),
    );
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
