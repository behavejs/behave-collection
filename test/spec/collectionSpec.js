/* jshint maxstatements:20 */

import BehaveCollection from '../../src/index';
import sinon from 'sinon';

describe('BehaveCollection', () => {
    var i = 0;
    var modelBuilder = (params) => {
        if (i === 3) i = 0;
        return {
            _id: i++,
            toJS: () => { return params; },
            toJSON: () => { return JSON.stringify(params); }
        };
    };

    beforeEach(() => {
        this.collection = new BehaveCollection();
    });

    describe('.add(model, opts)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({a: 1});
            this.model2 = modelBuilder({a: 1});
            this.model3 = modelBuilder({b: 1});
        });

        it('should be defined', (done) => {
            expect(this.collection.add).toBeDefined();
            done();
        });

        it('should add the passed in model to the models property', (done) => {
            this.collection.add(this.model1);
            expect(this.collection.models.length).toBe(1);
            done();
        });

        it('should emit an `add` event unless silent option is `true`', (done) => {
            var spy = sinon.spy();
            this.collection.on('add', spy);
            this.collection.add(this.model1);
            expect(spy.callCount).toBe(1);

            this.collection.add(this.model2, { silent: true });
            expect(spy.callCount).toBe(1);
            done();
        });
    });

    describe('.batch(models, opts)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({a: 1});
            this.model2 = modelBuilder({a: 1});
            this.model3 = modelBuilder({b: 1});
        });

        it('should be defined', (done) => {
            expect(this.collection.batch).toBeDefined();
            done();
        });

        it('should add the passed in models to the models property', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            expect(this.collection.models.length).toBe(3);
            done();
        });

        it('should emit an `add` event unless silent option is `true`', (done) => {
            var spy = sinon.spy();
            this.collection.on('add', spy);
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            expect(spy.callCount).toBe(3);

            done();
        });
    });

    describe('.remove(id, opts)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({a: 1});
            this.model2 = modelBuilder({a: 1});
            this.model3 = modelBuilder({b: 1});
        });

        it('should be defined', (done) => {
            expect(this.collection.remove).toBeDefined();
            done();
        });

        it('should remove model with passed in `id` from collection', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            var model = this.collection.remove(0);
            expect(model._id).toBe(0);
            expect(this.collection.models.length).toBe(2);
            done();
        });

        it('should emit a `remove` event unless silent option is `true`', (done) => {
            var spy = sinon.spy();
            this.collection.on('remove', spy);
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            this.collection.remove(0);
            expect(spy.callCount).toBe(1);

            this.collection.remove(1, { silent: true });
            expect(spy.callCount).toBe(1);
            done();
        });
    });

    describe('.purge()', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({a: 1});
            this.model2 = modelBuilder({a: 1});
            this.model3 = modelBuilder({b: 1});
        });

        it('should be defined', (done) => {
            expect(this.collection.purge).toBeDefined();
            done();
        });

        it('should remove all models from collection', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            expect(this.collection.models.length).toBe(3);

            this.collection.purge();
            expect(this.collection.models.length).toBe(0);
            done();
        });

        it('should emit a `remove` event unless silent option is `true`', (done) => {
            var spy = sinon.spy();
            this.collection.on('remove', spy);
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            this.collection.remove(0);
            expect(spy.callCount).toBe(1);

            this.collection.remove(1, { silent: true });
            expect(spy.callCount).toBe(1);
            done();
        });
    });

    describe('.range(startIdx, endIdx)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({a: 1});
            this.model2 = modelBuilder({a: 1});
            this.model3 = modelBuilder({b: 1});
        });

        it('should be defined', (done) => {
            expect(this.collection.range).toBeDefined();
            done();
        });

        it('should return range of models, including end index model', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var models = this.collection.range(0, 1);
            expect(models.length).toBe(2);
            expect(models[0]._id).toBe(0);
            expect(models[1]._id).toBe(1);
            done();
        });

        it('should return an empty array if no matches', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var models = this.collection.range(4, 10);
            expect(models.length).toBe(0);
            done();
        });
    });

    describe('.at(idx)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({a: 1});
            this.model2 = modelBuilder({a: 1});
            this.model3 = modelBuilder({b: 1});
        });

        it('should be defined', (done) => {
            expect(this.collection.at).toBeDefined();
            done();
        });

        it('should return the model at the specified index', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var model = this.collection.at(0);
            expect(model).toBeDefined();
            expect(model._id).toBe(0);
            done();
        });

        it('should return undefined if no matches', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var model = this.collection.at(3);
            expect(model).not.toBeDefined();
            done();
        });
    });

    describe('.count()', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.count).toBeDefined();
            done();
        });

        it('should return count of models in collection', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            expect(this.collection.count()).toEqual(3);
            done();
        });
    });

    describe('.find(params)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.find).toBeDefined();
            done();
        });

        it('should return an array of all models with the required params', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            var models = this.collection.find({ a: 1 });
            expect(models.length).toBe(2);
            expect(models[0]._id).toBe(0);
            expect(models[1]._id).toBe(1);
            done();
        });

        it('should return an empty array if no matches found', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var models = this.collection.find({ a: 2 });
            expect(models.length).toBe(0);
            done();
        });
    });

    describe('.findWhere(params)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.findWhere).toBeDefined();
            done();
        });

        it('should return the first model that meets requirements', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);
            var model = this.collection.findWhere({ a: 1 });
            expect(model._id).toBe(0);
            done();
        });

        it('should return `undefined` if no matches found', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var model = this.collection.findWhere({ a: 2 });
            expect(model).not.toBeDefined();
            done();
        });
    });

    describe('.each(fn)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.each).toBeDefined();
            done();
        });

        it('should call passed in function on each model', (done) => {
            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);

            var spy = sinon.spy();
            this.collection.each(spy);
            expect(spy.callCount).toBe(3);
            expect(spy.calledWith(this.collection.models[0])).toBe(true);
            expect(spy.calledWith(this.collection.models[1])).toBe(true);
            expect(spy.calledWith(this.collection.models[2])).toBe(true);
            done();
        });
    });

    describe('.filter(fn)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.filter).toBeDefined();
            done();
        });

        it('should return each model that passes the iterator test method',
                (done) => {

            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);


            var models = this.collection.filter(m => m.toJS().a === 1);
            expect(models.length).toBe(2);
            expect(models[0]._id).toBe(0);
            expect(models[1]._id).toBe(1);
            done();
        });
    });

    describe('.map(fn)', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.map).toBeDefined();
            done();
        });

        it('should return array containing whatever is returned from iterator function',
                (done) => {

            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);


            var data = this.collection.map(m => m.toJS());
            expect(data.length).toBe(3);
            expect(data[0]).toEqual({ a: 1 });
            expect(data[1]).toEqual({ a: 1 });
            expect(data[2]).toEqual({ b: 1 });
            done();
        });
    });

    describe('.toJS()', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.toJS).toBeDefined();
            done();
        });

        it('should return array of objects containing each models data',
                (done) => {

            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);


            var data = this.collection.toJS();
            expect(data.length).toBe(3);
            expect(data[0]).toEqual({ a: 1 });
            expect(data[1]).toEqual({ a: 1 });
            expect(data[2]).toEqual({ b: 1 });
            done();
        });
    });

    describe('.toJSON()', () => {
        beforeEach(() => {
            this.model1 = modelBuilder({ a: 1 });
            this.model2 = modelBuilder({ a: 1 });
            this.model3 = modelBuilder({ b: 1 });
        });

        it('should be defined', (done) => {
            expect(this.collection.toJSON).toBeDefined();
            done();
        });

        it('should return JSON representation of objects containing each models data',
                (done) => {

            this.collection.batch([
                this.model1,
                this.model2,
                this.model3
            ]);


            var data = this.collection.toJSON();
            expect(data).toEqual(JSON.stringify([
                { a: 1 },
                { a: 1 },
                { b: 1 }
            ]));
            done();
        });
    });
});
