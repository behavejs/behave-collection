# behave-collection
A collection class to simplify working with BehaveImmutable instances

[![Codeship Status for behavejs/behave-collection](https://codeship.com/projects/c697c3b0-8994-0132-8209-4635861fb902/status?branch=master)](https://codeship.com/projects/59761)

[BehaveImmutable](https://github.com/behavejs/behave-immutable) models have a lot of great features but working with groups of them can be tough, `BehaveCollection` strives to make this a trivial thing.

If you are not familiar with the concepts of BehaveImmutable models then I would suggest reading up on them first. This will help you understand the API of `BehaveCollection`.

### Install
```shell
npm install --save behave-collection
```

### Usage
```javascript
import BC from 'behave-collection';
import BI from 'behave-immutable';

let collection = new BC([
    new BI({ some: 'value' }),
    new BI({ another: 'value' }),
    new BI({ arr: [1, 2, 3] })
]);

/* accessing models */
collection.at(0).toJS();
// => { some: 'value' }

collection.range(0, 2);
// returns array of models in range (includes end index model)
// => [BehaveImmutabe, ..., BehaveImmutable]

collection.find({ some: 'value' });
// returns array of models containing values given
// => [BehaveImmutabe] || []

collection.findWhere({ some: 'value' });
// returns first model containing the values given
// => BehaveImmutabe || undefined

/* iterating over the collection */
collection.each(m => m.set({ updated: true }));
// => BehaveCollection

var rawJS = collection.map(m => m.toJS());
// => [{some: 'value'}, {another: 'value'}, {arr: [1, 2, 3]}]

var filteredModels = collection.filter(m => m.get().get('some') === 'value');
// get latest version of data, get `some` property from that data

/* quick extraction of collection data */
collection.toJS();
// => [{ some: 'value'  }, { another: 'value' }, { arr: [1, 2, 3] }]

collection.toJSON();
// => [{ "some": "value" }, { "another": "value" }, { "arr": [1, 2, 3] }]


/* altering the collection */
collection.add(new BI({ model: true }));
// adds a model to the collection, fires add event unless opts.silent is true

var batched = collection.batch([
    new BI({ some: 'value' }),
    new BI({ another: 'value' }),
    new BI({ arr: [1, 2, 3] })
]);
// returns array of added models, fires add event for each model unless opts.silent is true

var removed = collection.remove(collection.at(0)._id);
// removes a model from the collection, fires remove event unless opts.silent is true

collection.purge();
// remove all models from the collection

collection.count();
// get count of models

```

### Testing

Run `npm install` and then run `npm test`.

### Release History

- 0.1.0 Initial Release
