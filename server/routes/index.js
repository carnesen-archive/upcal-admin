'use strict';

const C = require('../Constants');

var context = { title: C.name };

module.exports = {
  path: '/',
  method: 'get',
  handler(req, res) {
    res.render('index', context);
  }
};