'use strict';

var router = require('express').Router();

const C = require('../Constants');

router.get('/', (req, res) => res.render('index', { title: C.name }));

module.exports = router;
