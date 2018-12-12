var mongoose = require('mongoose')

const formSchema = new mongoose.Schema({
  formData: { type: Object },
  owner: { type: String },
});

module.exports = mongoose.model('Form', formSchema);
