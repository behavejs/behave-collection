import {matches} from 'lodash'; // TODO: remove this single dependency
import BehaveEvents from 'behave-events';

var guid = (() => {
    var s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    };

    return () => {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
    };
})();

var each = (collection, fn) => {
    var idx = 0;
    for (let i = 0, len = collection.length; i < len; i++) {
        fn(collection[i], idx++, collection);
    }
};

var any = (collection, fn) => {
    var idx = 0;
    for (let i = 0, len = collection.length; i < len; i++) {
        if(fn(collection[i], idx++, collection)) return collection[i];
    }
};

var map = (collection, fn) => {
    var idx = 0, ret = [];
    for (let i = 0, len = collection.length; i < len; i++) {
        ret.push(fn(collection[i], idx++, collection));
    }
    return ret;
};

var filter = (collection, fn) => {
    var idx = 0, ret = [];
    for (let i = 0, len = collection.length; i < len; i++) {
        if(fn(collection[i], idx++, collection)) ret.push(collection[i]);
    }
    return ret;
};

class BehaveCollection extends BehaveEvents {
    constructor(models=[]) {
        this._id = `bc-${guid()}`;
        this.models = models;
        return this;
    }

    add(model, opts={}) {
        this.models.push(model);
        if (!opts.silent) this.emit('add', model);
        return model;
    }

    batch(models, opts={}) {
        each(models, (m) => {
            this.add(m, opts);
        });
        return this;
    }

    remove(id, opts={}) {
        var idx, toRemove;
        for (let i = 0; i < this.models.length; i++) {
            if (this.models[i]._id === id) idx = i;
        }

        toRemove = this.models.splice(idx, 1);
        if (!toRemove.length) return;
        if (!opts.silent) this.emit('remove', toRemove[0]);
        return toRemove[0];
    }

    purge() {
        this.models.length = 0;
        return this;
    }

    find(params) {
        var testDeepMatch = matches(params);
        return filter(this.models, (m) => {
            return testDeepMatch(m.toJS());
        });
    }

    findWhere(params) {
        var testDeepMatch = matches(params);
        return any(this.models, (m) => {
            return testDeepMatch(m.toJS());
        });
    }

    each(fn) {
        each(this.models, fn);
        return this;
    }

    map(fn) {
        return map(this.models, fn);
    }

    filter(fn) {
        return filter(this.models, fn);
    }

    toJS() {
        return map(this.models, m => m.toJS());
    }

    toJSON() {
        return JSON.stringify(map(this.models, m => m.toJS()));
    }
}

export default BehaveCollection;
