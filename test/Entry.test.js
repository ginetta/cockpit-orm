import Entry from '../src/Entry';
import cockpit from './cockpit';

test('Should create without errors ', () => {
  class TestEntry extends Entry {
    static slugField = 'title_slug';
    static schema = { fields: [{ name: 'title' }] };
  }

  const entry = new TestEntry({ title: 'Foo bar' });

  expect(entry.toObject()).toMatchSnapshot();
});

test('Should get slug fields ', () => {
  class TestEntry extends Entry {
    static slugField = 'title_slug';
    static schema = { fields: [{ name: 'title', options: { slug: true } }] };
  }

  const entry = new TestEntry({ title: 'Foo bar', title_slug: 'foo-bar' });
  const slugValue = entry.get('title_slug');

  expect(slugValue).toBe('foo-bar');
});

test('Should get slug field by setting slug', () => {
  class TestEntry extends Entry {
    static slugField = 'title_slug';
    static schema = { fields: [{ name: 'title', options: { slug: true } }] };
  }

  const entry = new TestEntry({ title: 'Foo bar' });

  entry.setSlug('foo-bar');

  const slugValue = entry.get('title_slug');

  expect(slugValue).toBe('foo-bar');
  expect(entry.toObject()).toMatchSnapshot();
});

test('Should sync with slug field', () => {
  expect.assertions(3);

  class TestEntry extends Entry {
    static slugField = 'title_slug';
    static schema = {
      name: 'test',
      fields: [{ name: 'title', options: { slug: true } }],
    };
    static cockpit = cockpit;
  }

  const entry = new TestEntry({ title: 'Foo bar' });

  entry.setSlug('foo-bar');

  return entry.sync().then(value => {
    expect(value.toObject().title).toBe('Foo bar');
    expect(value.toObject()._id).not.toBe(undefined);
    expect(value.toObject()._mby).not.toBe(undefined);
  });
});

test('Should update entry', async () => {
  class TestEntry extends Entry {
    static slugField = 'title_slug';
    static schema = {
      name: 'test',
      fields: [{ name: 'title', options: { slug: true } }, { name: 'body' }],
    };
    static cockpit = cockpit;
  }

  const entry = new TestEntry().setSlug('foo-bar');

  await entry.sync();

  expect(entry.toObject().body).toBe('test body');

  entry.set('body', 'test foo');

  await entry.save();

  expect(entry.toObject().body).toBe('test foo');

  entry.set('body', 'test body');

  await entry.save();

  expect(entry.toObject().body).toBe('test body');
});

test('Should add new Entry', () => {
  expect.assertions(4);

  class TestEntry extends Entry {
    static cockpit = cockpit;
    static slugField = 'title_slug';
    static schema = {
      name: 'test',
      fields: [{ name: 'title', options: { slug: true } }, { name: 'body' }],
    };
  }

  const entry = new TestEntry({ title: 'Hello world' });

  expect(entry.get('title')).toBe('Hello world');
  expect(entry.has('body')).toBe(false);

  return entry.save().then(value => {
    expect(value.toObject().title).toBe('Hello world');
    expect(value.toObject()._id).toBeTruthy();
  });
});
