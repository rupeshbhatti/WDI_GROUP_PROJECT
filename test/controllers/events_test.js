/* globals api, expect, describe, beforeEach, it */

require('../spec_helper');

const Event = require('../../models/event');

describe('Event tests', ()=> {
  describe('GET /api/events', () => {
    it('should return a 200 response', function(done) {
      api
        .get('/api/events')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });

  beforeEach(done => {
    Event.collection.drop();
    done();
  });

  beforeEach(done => {
    Event.create({
      name: 'Party',
      location: {
        lat: 32,
        lng: 34
      },
      type: 'stag',
      description: 'stag party',
      dateTime: '34632',
      owner: 'Dave',
      attendees: 'Sally'
    })
      .then(() => done())
      .catch(done);
  });

  it('should return an array of events', function(done) {
    api
      .get('/api/events')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('should return an array of event objects', function(done) {
    api
      .get('/api/events')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body)
          .and.be.an('array')
          .and.have.property(0)
          .and.have.all.keys([
            'name',
            'location',
            'type',
            'description',
            'dateTime',
            'owner',
            'attendees',
            '__v',
            '_id'

          ]);
        done();
      });
  });
  it('event objects should have properties: name, location, type, description, dateTime, owner, attendees, id', function(done){
    api
      .get('/api/events')
      .set('Accept', 'application/json')
      .end((err, res) => {
        const firstEvent = res.body[0];
        expect(firstEvent)
          .to.have.property('name')
          .and.to.be.a('string');
        expect(firstEvent)
          .to.have.property('location')
          .and.to.be.a('object');
        expect(firstEvent)
          .to.have.property('type')
          .and.to.be.a('string');
        expect(firstEvent)
          .to.have.property('description')
          .and.to.be.a('string');
        expect(firstEvent)
          .to.have.property('dateTime')
          .and.to.be.a('string');
        expect(firstEvent)
          .to.have.property('owner')
          .and.to.be.a('string');
        expect(firstEvent)
          .to.have.property('attendees')
          .and.to.be.a('string');
        expect(firstEvent)
          .to.have.property('_id')
          .and.to.be.a('string');
        done();
      });
  });

  describe('Make multiple events', () => {

    beforeEach(done => {
      Event.create([
        {
          name: 'Party',
          location: {
            lat: 32,
            lng: 34
          },
          type: 'stag',
          description: 'stag party',
          dateTime: '34632',
          owner: 'Dave',
          attendees: 'Sally'

        },
        {
          name: 'Wedding',
          location: {
            lat: 33,
            lng: 42
          },
          type: 'wedding',
          description: 'wedding party',
          dateTime: '34632',
          owner: 'Sally',
          attendees: 'Brock'
        }
      ])
        .then(() => done())
        .catch(done);
    });
    it('should return three events', done => {
      api
        .get('/api/events')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.body.length).to.equal(3);
          done();
        });
    });
  });


});