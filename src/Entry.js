import get from 'lodash.get';
import isEmpty from 'is-empty';

const has = x => !isEmpty(x);

export default class Entry {
  Map = new Map();

  defaultSchema = ['_by', '_created', '_id', '_mby', '_modified', '_order'];

  constructor({ cockpit, schema, fields }) {
    this.cockpit = cockpit;
    this.fields = fields;
    this.schema = schema;

    if (!this.fields) return console.error('Entry fields cannot be empty');
    if (!this.schema) return console.error('Entry schema cannot be empty');

    [...schema.fields, ...this.defaultSchema.map(name => ({ name }))].forEach(
      ({ name }) => {
        this.Map.set(name, this.fields[name]);
      },
    );
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

  set(field) {
    return this.Map.set(field);
  }

  forEach(fn) {
    return this.Map.forEach(fn);
  }

  getImageField(field, options) {
    return this.cockpit.image(this.get(field, 'path'), options);
  }

  save() {}
}
