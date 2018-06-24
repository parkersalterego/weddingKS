const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
    pdf: {
        type: String,
        required: true
    }
});

const Example = module.exports = mongoose.model('Example', ExampleSchema);