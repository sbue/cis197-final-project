var express = require('express');
var router = express.Router();
var Form = require('../models/form.js');
var Submission = require('../models/submission.js');

router.get('/create', function (req, res) {
  res.render('create-form')
});

router.post('/create', function (req, res) {
  var f = new Form({owner: req.session.user.username, formData: req.body.formData});
  f.save(function (err, result) {
    if (err) {
      next(err)
    }
    if (!err) {
      res.send(JSON.stringify({ formId: f._id }));
    }
  });
});

router.post('/save/:formId', function (req, res) {
  Form.findOne({ _id: req.params.formId }, function (err, f) {
    if (!err && f != null) {
      f.formData = req.body.formData;
      f.save(function (err, result) {
        if (err) {
          next(err)
        }
        if (!err) {
          res.send(JSON.stringify({}));
        }
      });
    } else {
      next(new Error('Invalid form id'))
    }
  })
});

router.get('/view/:formId', function (req, res) {
  Form.findOne({ _id: req.params.formId }, function (err, f) {
    if (!err && f != null) {
      if (req.session.user && req.session.user.length > 0 && req.session.user.username == f.owner) {
        res.render('edit-form', {
          formData: f.formData,
          formId: req.params.formId,
        });
      } else {
        res.render('view-form', {
          formData: f.formData,
          formId: req.params.formId,
        });
      }
    } else {
      next(new Error('Invalid form id'))
    }
  })
});

router.post('/view/:formId', function (req, res) {
  Form.findOne({ _id: req.params.formId }, function (err, f) {
    if (!err && f != null) {
      console.log(req.body)
      submission = new Submission({formId: req.params.formId, values: JSON.stringify(req.body)})
      submission.save(function (err, result) {
        if (err) {
          next(err)
        }
        if (!err) {
          res.render('view-form', {
            formData: f.formData,
            formId: req.params.formId,
          });
        }
      });
    } else {
      next(new Error('Invalid form id'))
    }
  })
});

router.get('/submissions/:formId', function (req, res) {
  Form.find({ _id: req.params.formId }, function (err, f) {
    if (!err && f != null) {
      Submission.find({ formId: req.params.formId }, function (err, results) {
        if (!err) {
          res.render('submissions', {
            submissions: results.map(r => r.values),
          });
        } else {
          next(new Error('something went wrong'))
        }
      })
    } else {
      next(new Error('Invalid form id'))
    }
  })
});

module.exports = router;
