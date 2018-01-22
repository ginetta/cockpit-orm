# Cockpit ORM

### Create a representations of you collections and entries to manage data without manually fetching the Cockpit API.

```sh
npm install cockpit-orm
# or
yarn add cockpit-orm
```

## Get started:

# Entry

The Entry class is for mapping **one** single entry of a collection.

* Create a new Entry class by extending `Entry`.
* Use the schema given by Cockpit so your local entry knows the collection name and fields.
* Use a authenticated [Cockpt SDK](https://www.npmjs.com/package/cockpit-sdk) instance that will be called internally.
* Set an optional `slugField` to use a handy slug that will identify this Entry instead of `_id`. When the `slugField` is _undefined_ the `_id` field will be used.

```js
import { Entry } from "cockpit-orm";
import schema from "../schemas/Portfolioitems.json";
import cockpit from "../"; // Initiated CockpitSDK instance.

class Post extends Entry {
  static cockpit = cockpit;
  static slugField = "title_slug";
  static schema = {
    // Cockpit collection schema.
    name: "post",
    fields: [{ name: "title", options: { slug: true } }, { name: "body" }]
  };
}
```

### Sync new Post by slug.

```js
async () => {
  const post = new Post();

  post.setSlug("hello-work");

  await post.sync(); // Fetches cockpit and fill all other fields.

  post.get("title");
  post.get("body");
};
```

### Add new entry.

```js
const post = new Post({ title: "Hello" });

post.get("title"); // Hello
post.has("body"); // false

post.save(); // POST to cockpit
```

### Update entry.

```js
async () => {
  const post = new Post();

  post.setSlug("hello-work");

  await post.sync(); // Fetches cockpit and fill all other fields.

  post.set("title", "New title");
  post.set("body", "New body");

  await post.save(); // POST to cockpit
};
```

# Collection

The `Collection` class is for fetching the **whole** collection entries.

```js
import { Collection } from "cockpit-orm";
import Entry from "./Entry";
import cockpit from "../"; // Initiated CockpitSDK instance.

export default class PostCollection extends Collection {
  static collectionName = "Posts";
  static slugField = "title_slug";
  static cockpit = cockpit;
}
```

## Get entries

```js
const posts = new PostCollection();

const entries = posts.getEntries();
```

## Custom methods

```js
export default class PostCollection extends Collection {
  //...

  getPublished(fields) {
    return this.getObject(fields, { filter: { published: true } });
  }
}

const entries = new PostCollection().getPublished();
```
