// test.js
/*global beforeAll afterAll expect*/
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')
const { connect } = require('../models');
const uri = `${global.__MONGO_URI__}${global.__MONGO_DB_NAME__}`

let connection;
let db;

beforeAll(async() => {
    connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async() => {
    await connection.close();
    // await db.close();
});

describe('mongoose model test', () => {
    it('should test the mongoose model', async() => {
        const conn = await connect(uri);
        conn.model('Fork', new mongoose.Schema({ name: String }));

        const M = conn.model('Fork');
        const a = await M.create({ name: 'fork' });
        const spoon = await M.findOne({ name: 'spoon' });
        expect(spoon).toEqual(null);
        const fork = await M.findOne({ name: 'fork' });
        expect(fork.name).toEqual('fork');

        await conn.close()
    })
})

describe('testing mongodb local', () => {
    it('should connect and test basic mongo actions', async() => {
        const a = await db.collection('test').insertOne({ test: true })
        expect(a.insertedCount).toEqual(1);
        const b = await db.collection('test').deleteOne({ test: true });
        expect(b.result).toEqual({ n: 1, ok: 1 });
        const c = await db.collection('test').drop();
        expect(c).toEqual(true)
    })

    it('should aggregate docs from collection', async() => {
        const files = db.collection('files');

        await files.insertMany([
            { type: 'Document' },
            { type: 'Video' },
            { type: 'Image' },
            { type: 'Document' },
            { type: 'Image' },
            { type: 'Document' },
        ]);

        const topFiles = await files
            .aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ])
            .toArray();

        expect(topFiles).toEqual([
            { _id: 'Document', count: 3 },
            { _id: 'Image', count: 2 },
            { _id: 'Video', count: 1 },
        ]);
        const isDropped = await db.collection('files').drop()
        expect(isDropped).toEqual(true)
    });
});
