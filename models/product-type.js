// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

// set up a mongoose model and pass it using module.exports
var ProductType = new Schema({
    groupType: String,
    dataType: String, // 
    name: String,
    value: Object,
    priority: Number,
});
var ProductType = mongoose.model('ProductType', ProductType);
module.exports = ProductType;

module.exports.Init = function() {
    var list = [];
    list.push({
        groupType: 'loadGiaoDich',
        dataType: 'string', // 
        name: 'Mua',
    });
    list.push({
        groupType: 'loadGiaoDich',
        dataType: 'string', // 
        name: 'Bán',
    });

}