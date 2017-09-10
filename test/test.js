const request = require('supertest');
const app = require('../app.js');

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /schedules', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/schedules')
      .expect(200, done);
  });
});

describe('GET /schedules/biphasic', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/schedules/biphasic')
      .expect(200, done);
  });
});

describe('GET /submit', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/submit')
      .expect(200, done);
  });
});

describe('POST /submit', () => {
    it('should respond with redirect on post', function(done) {
    request(app)
      .post('/submit')
      .expect(302)
      .end(function(err, res) {
        if (err)
            done(err);
        else
            done();
      });
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/obamerdidnothingwrong2019')
      .expect(404, done);
  });
});
