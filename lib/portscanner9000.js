
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/commander/commander.d.ts" />
/// <reference path="../typings/colors/colors.d.ts" />
/// <reference path="../typings/async/async.d.ts" />

var portscanner = require('portscanner');
var wkp = require('well-known-ports');
var async = require('async');
var colors = require('colors');
var program = require('commander');
var uniq = require('lodash.uniq');
var sortby = require('lodash.sortby');

// export our functionality
module.exports = function functionality() {
	
	// describe and parse the arguments
	program
	  .alias('portscanner9000')
	  .description(require('../package.json').description)
	  .version(require('../package.json').version)
	  .usage("[options] [hostname]")
	  .option('-r, --range [<a>..<b>]', 'A port range to scan', function (val, ports) {
	      var numbers = val.split('..').map(Number);
	      for (var i = numbers[0]; i <= numbers[1]; i++) {
	        ports.push(i);
	      }
	      return ports;
	  },[])
	  .option('-p, --port [port]', 'A port to scan', function (val, ports) {
	    ports.push(Number(val));
	    return ports;
	  },[])
	  .parse(process.argv);
	
	// by default, scan localhost
	var hosts = (program.args.length > 0) ? program.args :
	  ["localhost"];
	
	// by default, scan all well known ports (converted to numbers, and excluding port 0)
	var ports = (program.range && program.port && program.range.length > 0 && program.port.length > 0) ?
		sortby(uniq(program.range.concat(program.port)), function (n) {return n; }) :
		  (program.range && program.range.length > 0) ? program.range :
		  (program.port && program.port.length > 0) ? program.port :
		  Object.keys(wkp).map(Number).filter(function (v) { return v !== 0; });
	
	// create the scanners (each port gets a 'thread')
	var funcs = [];
	hosts.forEach(function (hostname) {
	  ports.forEach(function (v) {
	    funcs.push(function (cb) {
	      portscanner.checkPortStatus(v, hostname, function (err, status) {
	        if (err) console.error(err, v);
	        cb(err, {host: hostname, port: v, status: status});
	      });
	    });
	  });
	});
	
	// run all the scanners and log the results on completion of all scanners
	async.parallel(funcs, function (err, results) {
	  if (err) return console.error(colors.red("ERROR - " + err));
	  
	  results.forEach(function (res) {
	    
	    // format status 
	    var status = res.status;
	    if (status === "open") status = colors.green(status);
	    else if (status === "closed") status = colors.red(status);
	    
	    // output (hostname inline, for easy grep-ing)
	    console.log(colors.grey(res.host)+":"+res.port+" - "+status+((res.status === "open") ? " (" + wkp[res.port.toString()] + ")" :""));
	  });
	});
};