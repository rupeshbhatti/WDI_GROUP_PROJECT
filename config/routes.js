const express = require('express');
const router  = express.Router();
const authentications = require('../controllers/authentications');
const users = require('../controllers/users');
const events = require('../controllers/events');

router.route('/register')
  .post(authentications.register);

router.route('/login')
  .post(authentications.login);

router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .patch(users.update)
  .delete(users.delete);

router.route('/events')
  .get(events.index)
  .post(events.create);

router.route('/events/:id')
  .get(events.show)
  .put(events.update)
  .patch(events.update)
  .delete(events.delete);

router.route('/events/:id/comments')
  .post(events.createComment);

router.route('/events/:id/comments/:commentId')
  .delete(events.deleteComment);

router.route('/events/:id/attendeesuggestions')
  .post(events.addAttendeeLocPref);

router.route('/events/:id/attendeesuggestions/:suggestionId')
  .delete(events.deleteAttendeeLocPref);

module.exports = router;
