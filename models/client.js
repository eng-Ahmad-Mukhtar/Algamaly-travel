const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    name: { type: String , required:true}, 
    passportId: { type: String , required:true}, 
    directorName: { type: String , required:true}, 
    direction: { type: String , required:true}, 
    status: { type: String}, 
    phoneNumber: { type: String }, 
    notes: { type: String}, 
});


const UserSchema = new Schema({
    travel_details: { type: String , required:true}, 
    subscriptions: [SubscriptionSchema] 
}, { timestamps: true });

module.exports = mongoose.model('clients', UserSchema);