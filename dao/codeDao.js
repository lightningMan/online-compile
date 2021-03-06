var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var iDate = require('../tools/iDate');

var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}


//定义Code对象模型
var CodeScheme = new Schema({
	id: {type: String, index: {unique: true}},
	src: String,
	input: String,
	post_date: {type: Date, default: Date.now}
});

var SimpleLogSchema = new Schema({
	log: {type: String}, create_at: {type: Date}
});

//访问todo对象模型
mongoose.model('Code', CodeScheme);
var Code = mongoose.model('Code');
mongoose.model('SimpleLog', SimpleLogSchema);
var SimpleLog = mongoose.model('SimpleLog');

exports.simpleLog = function(log, callback) {
  var ilog = new SimpleLog();
  ilog.log = log;
  ilog.create_at = iDate.getDateObj();
  ilog.save(function(err, doc) {
    callback(err, doc);
  })
}
exports.findAllLog = function(callback) {

	SimpleLog.find()
		.sort({create_at: -1})
		.exec(function(err, logs) {
      console.log(logs.length);
	  callback(err, logs);
	});
}
exports.addCode = function(id, src, input, callback) {
    var code = new Code();
	code.id = id;
    code.src = src;
	code.input = input;
    code.save(function(err, doc){
		callback(err, doc);
    });

}

exports.findCodeById = function(id, callback){
	Code.findOne({id: id}, function(err,doc){
		if (!err)
		callback(err, doc);
		else
		callback(err, null);
	});
};
