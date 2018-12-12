var mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  formId: { type: String },
  values: { type: String },
});

module.exports = mongoose.model('Submission', submissionSchema);
