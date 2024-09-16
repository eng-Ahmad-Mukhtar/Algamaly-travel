const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const introSchema = new Schema({

    directorName: { type: String , required:true}, 
    date: { type: Date },
    direction: { type: String }, 
    status: { type: String}, 
    phoneNumber: { type: String }, 
    notes: { type: String}, 
});


const IntroducerSchema = new Schema({
    name: { type: String , required:true}, 
    subscriptions: [introSchema] 
}, { timestamps: true });

module.exports = mongoose.model('Introducer', IntroducerSchema);