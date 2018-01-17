export const arrayHead = arr => (arr && arr.length ? arr[0] : null);
export const entriesHead = ({ entries }) =>
  entries.length ? entries[0] : null;
export const getField = (field, lang, suffix = '') =>
  `${field}${lang ? `_${lang}` : ''}${suffix}`;

export default {
  getField,
  arrayHead,
  entriesHead,
};
