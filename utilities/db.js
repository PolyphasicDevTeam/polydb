const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const app = require('../app.js')

exports.init = function(){
    var nu;
    fs.stat('./data/scheds.db', function(err, stat) {
        if(err == null) {
            nowgo(false)
        } else if(err.code == 'ENOENT') {
            nowgo(true)
        } else {
            console.log('Some other error: ', err.code);
        }
    });

    function nowgo(nu){
        if(nu){
        	var scheds = fs.readFileSync(app.scheds).toString().split("\n");

                db = new sqlite3.Database('./data/scheds.db');

                console.log('Creating new database...')
            	db.serialize(function() {
                    db.run('CREATE TABLE users()')
            	    db.run('CREATE TABLE general(id INTEGER PRIMARY KEY, sched TEXT, quantity INTEGER, desc TEXT, alias TEXT)')
            	    for(i in scheds) {
                        sched = scheds[i].split(':')[0]
                        desc = scheds[i].split(':')[1]
                        alias = scheds[i].split(':')[2]
                        if(typeof alias == 'undefined'){
                            alias = ''
                        }
                		if(scheds[i]){
                		    db.run(`CREATE TABLE ${sched}(id INTEGER PRIMARY KEY, success BOOLEAN, adapt_diff NUMERIC, adapt_time NUMERIC, social_impact NUMERIC, sleep_duration NUMERIC, recommend BOOLEAN, napchart TEXT)`);
                		    db.run(`INSERT INTO general VALUES(NULL,'${sched}',0,'${desc}','${alias}')`)
                		}
            	    }
            	})
        	console.log('Database initialized!')
            return

        }else{
        	db = new sqlite3.Database('./data/scheds.db');
        	console.log('Database initialized!')
            return
        }
    }
}

exports.run = function(query,callback){
    db.run(query,callback)
}

exports.all = function(query,callback){
    db.all(query,callback)
}

exports.get = function(query,callback){
    db.get(query,callback)
}
