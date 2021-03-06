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
      coverImage: 'www.fillmurray.com/300/300',
      type: 'stag',
      description: 'stag party',
      dateTime: '34632',
      owner: '5a0b606e9f16a022c800353a',
      attendees: '5a0b606e9f16a022c800353a'
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
            'coverImage',
            'location',
            'type',
            'description',
            'dateTime',
            'owner',
            'attendees',
            'comments',
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
          coverImage: 'www.fillmurray.com/300/300',
          type: 'stag',
          description: 'stag party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'

        },
        {
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
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


  describe('POST /api/events', () => {
    it('should return a 201 response', done => {
      api
        .post('/api/events')
        .set('Accept', 'application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'

        })
        .expect(201, done);
    });

    it('should create an event', done => {
      api
        .post('/api/events')
        .set('Accept', 'application/json')
        .send({
          event: {
            name: 'birthday party',
            location: {
              lat: 20,
              lng: 31
            },
            coverImage: 'www.fillmurray.com/300/250',
            type: 'birthday',
            description: 'birthday party',
            dateTime: '34632',
            owner: '5a0b606e9f16a022c800353a',
            attendees: '5a0b606e9f16a022c800353a'
          }
        })
        .end((err, res) => {
          const event = res.body;

          expect(event)
            .to.have.property('_id')
            .and.to.be.a('string');
          expect(event)
            .to.have.property('name')
            .and.to.be.a('string');
          expect(event)
            .to.have.property('location')
            .and.to.be.a('object');
          expect(event.location)
            .to.have.property('lat')
            .and.to.be.a('number');
          expect(event.location)
            .to.have.property('lng')
            .and.to.be.a('number');
          expect(event)
            .to.have.property('type')
            .and.to.be.a('string');
          expect(event)
            .to.have.property('description')
            .and.to.be.a('string');
          expect(event)
            .to.have.property('dateTime')
            .and.to.be.a('string');
          expect(event)
            .to.have.property('owner')
            .and.to.be.a('string');
          expect(event)
            .to.have.property('attendees')
            .and.to.be.a('string');
          done();
        });
    });
  });

  describe('GET /api/events/:id', () => {

    let eventer;

    beforeEach(done => {
      Event.collection.drop();
      done();
    });

    beforeEach(done => {
      Event.create({
        name: 'birthday party',
        location: {
          lat: 20,
          lng: 31
        },
        coverImage: 'www.fillmurray.com/300/250',
        type: 'birthday',
        description: 'birthday party',
        dateTime: '34632',
        owner: '5a0b606e9f16a022c800353a',
        attendees: '5a0b606e9f16a022c800353a'
      })
        .then(eventData => {
          eventer = eventData;
          done();
        })
        .catch(done);
    });
    it('should return a 200 response', done => {
      api
        .get(`/api/events/${eventer.id}`)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
    describe('DELETE /api/events/:id', ()=> {


      it('should return a 204 response', done => {
        api
          .delete(`/api/events/${eventer.id}`)
          .set('Accept', 'application/json')
          .expect(204);
        done();
      });
    });

  });
  describe('PUT /api/events/:id', () => {
    let testEvent;

    beforeEach(done => {
      Event.collection.drop();
      done();
    });

    beforeEach(done => {
      Event.create({
        name: 'birthday party',
        location: {
          lat: 20,
          lng: 31
        },
        coverImage: 'www.fillmurray.com/300/250',
        type: 'birthday',
        description: 'birthday party',
        dateTime: '34632',
        owner: '5a0b606e9f16a022c800353a',
        attendees: '5a0b606e9f16a022c800353a'
      })
        .then(eventData => {
          testEvent = eventData;
          done();
        })
        .catch(done);
    });

    it('Should be possible to update the name of an event', done => {
      api
        .put(`/api/events/${testEvent.id}`)
        .set('Accept', 'application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
        })
        .expect(200, done);
    });

    it('Should be possible to update the location of an event', done => {
      api
        .put(`/api/events/${testEvent.id}`)
        .set('Accept', 'application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
        })
        .expect(200, done);
    });

    it('Should be possible to update the type of an event', done => {
      api
        .put(`/api/events/${testEvent.id}`)
        .set('Accept', 'application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
        })
        .expect(200, done);
    });

    it('Should be possible to update the description of an event', done => {
      api
        .put(`/api/events/${testEvent.id}`)
        .set('Accept', 'application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
        })
        .expect(200, done);
    });

    it('Should be possible to update the date/time of an event', done => {
      api
        .put(`/api/events/${testEvent.id}`)
        .set('Accept','application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
        })
        .expect(200, done);
    });

    it('Should be possible to update the attendees of an event', done => {
      api
        .put(`/api/events/${testEvent.id}`)
        .set('Accept', 'application/json')
        .send({
          name: 'birthday party',
          location: {
            lat: 20,
            lng: 31
          },
          coverImage: 'www.fillmurray.com/300/250',
          type: 'birthday',
          description: 'birthday party',
          dateTime: '34632',
          owner: '5a0b606e9f16a022c800353a',
          attendees: '5a0b606e9f16a022c800353a'
        })
        .expect(200, done);
    });



  });
});
