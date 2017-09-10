var express = require('express');
var router = express.Router();
var func = require('../utilities/functions.js')

/* GET home page. */
router.get('/', function(req, res, next) {
    func.genTables(callback)
    function callback(html){
      res.render('index', {
          title: 'polyDB',
          html: html
      });
  }
});

router.get('/users/:user', function(req,res,next){

});

router.get('/users', function(req,res,next){
    func.userlist(callback)
    function callback(users){
        res.render('users',{
            title: 'Users - polyDB',
            users: users
        })
    }
})

router.get('/schedules/:sched', function(req, res, next) {
    func.getVars(req.params.sched,callback)
    function callback(pop,success,adapt_diff,adapt_time,social_impact,sleep_duration,recc,alias,desc){
        sched = req.params.sched
        lastch = sched.substr(sched.length - 1)
        if(!isNaN(lastch)){
            sched = sched.slice(0,-1)+' '+lastch
        }
        niceone = sched.charAt(0).toUpperCase()+sched.slice(1)

        func.schedTable(req.params.sched,callback)
        function callback(table){
          res.render('schedview', {
              title: niceone+' - polyDB',
              name: niceone,
              sched: req.params.sched,
              pop: pop,
              sr: success,
              ad: adapt_diff,
              at: adapt_time,
              si: social_impact,
              sd: sleep_duration,
              recc: recc,
              desc: desc,
              alias: alias,
              table: table
          });
      }
  }
});

router.get('/schedules', function(req, res, next) {
    func.schedList(callback)
    function callback(funclist,nicelist){
        html = ''
        after = '</ul><br><ul class="list"><li style="float:left;list-style-type:none;">Schedules with no data</li><br>'
        for(i in funclist){
            inf = funclist[i].split(':')
            if(!isNaN(inf[1])){
                after += `<li style="float:left;"><a href="/schedules/${inf[0]}">${nicelist[i]}</a></li><br>`
            }else{
                html += `<li style="float:left;"><a href="/schedules/${inf[0]}">${nicelist[i]}</a></li><br>`
            }
        }
        html += after;
      res.render('schedules', {
          title: 'polyDB - Schedule list',
          list: html
      });
  }
});

router.get('/submit', function(req, res, next) {
    func.genForm(callback)

    function callback(form){
    	res.render('submit', {
    	    title: 'polyDB - Share',
    	    form: form
    	});
    }
});

module.exports = router;
