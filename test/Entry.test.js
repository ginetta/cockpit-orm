import Entry from '../src/Entry';

test('Should create without errors ', () => {
  const schema = { fields: [{ name: 'title' }] };

  class TestEntry extends Entry {
    static slugField = 'title_slug';

    constructor(fields, options) {
      super({ cockpit: {}, schema, fields, ...options });
    }
  }

  const entry = new TestEntry({ title: 'Foo bar' });

  expect(entry).toMatchSnapshot();
});

test('Should get slug fields ', () => {
  const schema = { fields: [{ name: 'title', options: { slug: true } }] };

  class TestEntry extends Entry {
    static slugField = 'title_slug';

    constructor(fields, options) {
      super({ cockpit: {}, schema, fields, ...options });
    }
  }

  const entry = new TestEntry({ title: 'Foo bar', title_slug: 'foo-bar' });
  const slugValue = entry.get('title_slug');

  expect(slugValue).toBe('foo-bar');
});
