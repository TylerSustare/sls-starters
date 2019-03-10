// test.js
/*global beforeAll afterAll expect*/
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')
const { connect, Fork } = require('../models');
const uri = `${global.__MONGO_URI__}${global.__MONGO_DB_NAME__}`

let connection;
let db;
let conn;

beforeAll(async() => {
    // regular mongodb
    connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    db = await connection.db(global.__MONGO_DB_NAME__);
    // mongoose
    conn = await connect(uri);
});

afterAll(async() => {
    // regular mongodb
    await connection.close();
    // mongoose
    await conn.close()
});

describe('testing mongoose model', () => {
    it('should test the mongoose model', async() => {
        const M = Fork(conn);
        expect(M.rules()).toEqual('Salad forks are smaller');
        await M.create({ name: 'fork', prongs: 4 });
        const spoon = await M.findOne({ name: 'spoon' });
        expect(spoon).toEqual(null);
        const fork = await M.findOne({ name: 'fork' });
        expect(fork.name).toEqual('fork');

        const fourProngForks = await M.getAllByProngs(4);
        expect(fourProngForks).toHaveLength(1);
    });
});

describe('testing mongodb local', () => {
    it('should connect and test basic mongo actions', async() => {
        const a = await db.collection('test').insertOne({ test: true })
        expect(a.insertedCount).toEqual(1);
        const b = await db.collection('test').deleteOne({ test: true });
        expect(b.result).toEqual({ n: 1, ok: 1 });
        const c = await db.collection('test').drop();
        expect(c).toEqual(true)
    })

    it('should test mongo docs from collection', async() => {
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
