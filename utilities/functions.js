db = require('./db.js')
numeral = require('numeral')

function numFormat(num,form){
    if(typeof form == 'undefined')
        form = '%'
    switch(form){
        case '%':
            form = '0[.]00%'
            break
        case 'time':
            form = '00:00'
            break
    }
    let final = numeral(num).format(form);
    return final;
}

function nameFormat(name){
    lastch = name.substr(name.length - 1)
    if(!isNaN(lastch)){
        sched = name.slice(0,-1)+' '+lastch
    }else{
        sched = name
    }
    name = sched.charAt(0).toUpperCase()+sched.slice(1)
    return name
}

exports.userlist = function(callback){
    users = '<li>doot</li>'
    users += '<li>dasdft</li>'


    callback(users)
}

exports.schedTable = function(sched,finalcb){
    let counter = 1,
    html = ''

    html += `<table class="tablesorter" style="width:100%;" id="maindata">
              <thead>
            <tr class="tablehead">
              <th>Succeeded</th>
              <th>Adaptation Difficulty</th>
              <th>Adaptation Time</th>
              <th>Social Impact</th>
              <th>Sleep Duration</th>
              <th>Reccomended</th>
              <th>Napchart</th>
            </tr>
              </thead>
              <tbody>`

      db.all(`SELECT * FROM ${sched}`,callback)
      function callback(err,rows){
          for(i in rows){
              if(rows[i].success == 1){
                  succ = "Yes"
              }else{
                  succ = "No"
              }
              if(rows[i].recommend == 1){
                  recc = "Yes"
              }else{
                  recc = "No"
              }
              if(rows[i].napchart != 'null'){
                  napchart = `<a style="text-decoration:none;color:white;" href="${rows[i].napchart}">${rows[i].napchart}</a>`
              }else{
                  napchart = 'Not submitted'
              }
              atime = numFormat(rows[i].adapt_time,'0')
              stime = numFormat(rows[i].sleep_duration,'time')

              diffnum = rows[i].adapt_diff
              switch(diffnum){
                  case 1:
                      adapt_diff = 'Very Easy'
                      break
                  case 2:
                      adapt_diff = 'Easy'
                      break
                  case 3:
                      adapt_diff = 'Moderately Easy'
                      break
                  case 4:
                      adapt_diff = 'Moderate'
                      break
                  case 5:
                      adapt_diff = 'Moderately Difficult'
                      break
                  case 6:
                      adapt_diff = 'Difficult'
                      break
                  case 7:
                      adapt_diff = 'Very Difficult'
                      break
              }

              sinum = rows[i].social_impact
              switch(sinum){
                  case 1:
                      social_impact = 'Very Small'
                      break
                  case 2:
                      social_impact = 'Small'
                      break
                  case 3:
                      social_impact = 'Moderately Small'
                      break
                  case 4:
                      social_impact = 'Moderate'
                      break
                  case 5:
                      social_impact = 'Moderately Significant'
                      break
                  case 6:
                      social_impact = 'Significant'
                      break
                  case 7:
                      social_impact = 'Very Significant'
                      break
            }

              html += `<tr class="sched"><td>${succ}</td><td>${adapt_diff}</td><td>${atime} days</td><td>${social_impact}</td><td>${stime}</td><td>${recc}</td><td>${napchart}</td>`
          }
          html += `</tbody></table>`
          finalcb(html)
      }
}

exports.genTables = function(finalcb){
    let counter = 1;
    var html = ''
    html += `<input type="text" id="tablesearch" onkeyup="searchTable()" placeholder="Search for schedules..">
            <br><br>
            <table class="tablesorter" style="width:100%;" id="maindata">
              <thead>
            <tr class="tablehead">
              <th>Schedule</th>
              <th>Popularity</th>
              <th>Success Rate</th>
              <th>Avg Adaptation Difficulty</th>
              <th>Avg Adaptation Time</th>
              <th>Avg Social Impact</th>
              <th>Avg Sleep Duration</th>
              <th>Reccomended by</th>
            </tr>
              </thead>
              <tbody>`

    db.all(`SELECT * FROM general`,callback)
    function callback(err,rows){
        for(let i=0;i<rows.length;i++){
            getVars(rows[i].sched,callback)
            function callback(pop,success,adapt_diff,adapt_time,social_impact,sleep_duration,recc,alias,desc){
                if(!isNaN(pop.replace('%',''))){
                    name = nameFormat(rows[i].sched)
                    html += `<tr class="sched"><td><a style="text-decoration:none;color:white;" href="/schedules/${rows[i].sched}">${name}</a></td><td>${pop}</td><td>${success}</td>
                            <td>${adapt_diff}</td><td>${adapt_time} days</td><td>${social_impact}</td><td>${sleep_duration}</td><td>${recc}</td></tr>`

                }
                if(counter >= rows.length){
                    launch()
                }else{
                    counter++
                }
            }
        }
        function launch(){
        html += `</tbody>
                </table>`
        finalcb(html)
    }

    }

}

exports.getVars = getVars = function(sched,finalcb){
    let total = 0,
    schedtotal = 0,
    succ = 0,
    si = 0,
    sic = 0,
    ad = 0,
    adc = 0,
    at = 0,
    atc = 0,
    st = 0,
    stc = 0,
    rec = 0,
    alias,
    desc;

    db.all(`SELECT * FROM general`,callback)
    function callback(err,rows){
        for(i in rows){
            total += parseInt(rows[i].quantity)
            if(rows[i].sched == sched){
                alias = rows[i].alias
                desc = rows[i].desc
            }
        }
        db.all(`SELECT * FROM ${sched}`,callback)
        function callback(err,rows){
            for(i in rows){
                row = rows[i]
                schedtotal++
                if(row.success == 1){
                    succ++
                }
                if(row.adapt_diff != 'null'){
                    ad += parseInt(row.adapt_diff)
                    adc++
                }
                if(row.adapt_time != 'null'){
                    at += parseInt(row.adapt_time)
                    atc++
                }
                if(row.social_impact != 'null'){
                    si += parseInt(row.social_impact)
                    sic++
                }
                if(row.sleep_duration != 'null'){
                    st += parseInt(row.sleep_duration)
                    stc++
                }
                if(row.recommend == 1){
                    rec++;
                }
            }
            //Parse vars
            pop = numFormat(schedtotal/total);
            success = numFormat(succ/schedtotal);
            adapt_time = numFormat(at/atc,'0')
            sleep_duration = numFormat(st/stc,'time')
            recc = numFormat(rec/schedtotal)

            diffnum = Math.round(ad/adc)
            switch(diffnum){
                case 1:
                    adapt_diff = 'Very Easy'
                    break
                case 2:
                    adapt_diff = 'Easy'
                    break
                case 3:
                    adapt_diff = 'Moderately Easy'
                    break
                case 4:
                    adapt_diff = 'Moderate'
                    break
                case 5:
                    adapt_diff = 'Moderately Difficult'
                    break
                case 6:
                    adapt_diff = 'Difficult'
                    break
                case 7:
                    adapt_diff = 'Very Difficult'
                    break
            }

            sinum = Math.round(si/sic)
            switch(sinum){
                case 1:
                    social_impact = 'Very Small'
                    break
                case 2:
                    social_impact = 'Small'
                    break
                case 3:
                    social_impact = 'Moderately Small'
                    break
                case 4:
                    social_impact = 'Moderate'
                    break
                case 5:
                    social_impact = 'Moderately Significant'
                    break
                case 6:
                    social_impact = 'Significant'
                    break
                case 7:
                    social_impact = 'Very Significant'
                    break
            }

            if(schedtotal == 0){
                pop = "No data has been submitted for this schedule yet."
                finalcb(pop,"","","","","","",alias,desc)
            }else{

            finalcb(pop,success,adapt_diff,adapt_time,social_impact,sleep_duration,recc,alias,desc)
            }
        }
    }

}

exports.genForm = function(callback){
    var qnum = 9
    var html = '<form method="post" action="/submit"><hr>'


    db.all(`SELECT * FROM general`,cb)
    function cb(err,rows){
    	html += '<span class="question active" data-num="1"><p>What schedule are you reporting on? (If your schedule isnt listed and you think it should be, contact me to let me know)</p><select name="schedule"><option>Select</option>'
    	for(i in rows){
            lastch = rows[i].sched.substr(rows[i].sched.length - 1)
            if(!isNaN(lastch)){
                sched = rows[i].sched.slice(0,-1)+' '+lastch
            }else{
                sched = rows[i].sched
            }
            niceone = sched.charAt(0).toUpperCase()+sched.slice(1)
    	    html+= `<option value="${rows[i].sched}">${niceone}</option>`
    	}
    	html += `</select></span>`


        html += `<span class="question" data-num='2'><p>Have you successfully adapted to this schedule?</p>
                <input type="radio" name="success" value="1"> Yes<br>
                <input type="radio" name="success" value="0"> No</span>`



        html += `<span class="question" data-num='3'><p>If yes, how difficult was adaptation?</p>
                <table id="quik" style="margin-left:auto;margin-right:auto;bborder:1px solid #ddd;">
                <tr>
                <td><input type="radio" name="adapt_diff" value="1">Very Easy</td>
                <td><input type="radio" name="adapt_diff" value="2">Easy</td>
                <td><input type="radio" name="adapt_diff" value="3">Moderately Easy</td>
                <td><input type="radio" name="adapt_diff" value="4">Moderate</td>
                <td><input type="radio" name="adapt_diff" value="5">Moderately Difficult</td>
                <td><input type="radio" name="adapt_diff" value="6">Difficult</td>
                <td><input type="radio" name="adapt_diff" value="7">Very Difficult</td>
                </tr>
                </table></span>`


        html += `<span class="question" data-num="4"><p>How long did it take you to adapt?</p>
                <input class="daycnt" type="text" name="adapt_time"> days</span>

                <span class="question" data-num="5"><p>How much of an impact did this schedule have on your social life?</p>
                <table id="quik" style="margin-left:auto;margin-right:auto;bborder:1px solid #ddd;">
                <tr>
                <td><input type="radio" name="social_impact" value="1">Very Small </td>
                <td><input type="radio" name="social_impact" value="2">Small </td>
                <td><input type="radio" name="social_impact" value="3">Moderately Small </td>
                <td><input type="radio" name="social_impact" value="4">Moderate </td>
                <td><input type="radio" name="social_impact" value="5">Moderately Significant </td>
                <td><input type="radio" name="social_impact" value="6">Significant </td>
                <td><input type="radio" name="social_impact" value="7">Very Significant </td>
                </tr>
                </table></span>`

        html += `<span class="question" data-num="6"><p>How much sleep did your schedule plan for?</p>
                <input class="daycnt" type="text" name="sleep_hours"> hours
                <input class="daycnt" type="text" name="sleep_mins"> minutes</span>`


        html += `<span class="question" data-num="7"><p>Would you reccomend this schedule to someone else?</p>
                <input type="radio" name="recommend" value="1"> Yes<br>
                <input type="radio" name="recommend" value="0"> No</span>`



        html += `<span class="question" data-num="8"><p>If youd like to share your napchart, place it here. This is optional.</p>
                <input type="text" name="napchart"></span>`

        html += `<span class="question" data-num="9"><p>Thats it! Thank you a ton for responding! It really helps us out. Don't forget to click submit, and have a great day!</p>
                <input class="submitForm" type="submit" value="Submit"></span>`



        html += `<br><br><br><hr><br><span><input class="nav back" style="float:left;" type="button" value="Previous">&nbsp;<input class="nav next" style="float:right;" type="button" value="Next"></span>

                <div class="qnum" style="display:none;">${qnum}</div>

                </form>`
    	callback(html)
    }
}

exports.formSubmit = function(req,res){
    var body = req.body
        for(i in body){
            if(body[i] == ''){
                body[i] = null;
            }
        }

        let schedule = body.schedule,
            success = body.success,
            adapt_diff = body.adapt_diff,
            adapt_time = body.adapt_time,
            social_impact= body.social_impact,
            sleep_mins = body.sleep_mins,
            sleep_hours = body.sleep_hours,
            recommend = body.recommend,
            napchart = body.napchart;

        if(napchart != null){
            if(!napchart.includes('napchart.com'))
                napchart = null
        }
        if(isNaN(adapt_time)){
            adapt_time = null
        }
        if(isNaN(sleep_mins) && isNaN(sleep_hours)){
            sleep_duration = null
        }else{
            sleep_duration = (sleep_hours*60)+sleep_mins*1
        }

        if(schedule != null && success != null){
            db.run(`SELECT * FROM general WHERE sched=${schedule}`,cb)
            function cb(err,row){
                if(success*1 == 0){
                    db.run(`INSERT INTO ${schedule} VALUES(NULL,0,${adapt_diff},'${adapt_time}',${social_impact},'${sleep_duration}',${recommend},'${napchart}')`)
                    db.run(`UPDATE general SET quantity=(quantity+1) WHERE sched='${schedule}'`)
                }else{
                    if(adapt_time != null && sleep_duration != null){
                        db.run(`INSERT INTO ${schedule} VALUES(NULL,1,${adapt_diff},'${adapt_time}',${social_impact},'${sleep_duration}',${recommend},'${napchart}')`)
                        db.run(`UPDATE general SET quantity=(quantity+1) WHERE sched='${schedule}'`)
                }
            }
        }
    }
    res.redirect('/')
}

exports.schedList = function(callback){
    let nicelist = [],
        funclist = []
    db.all(`SELECT sched,quantity FROM general`,cb)
    function cb(err,rows){
        for(i in rows){
            lastch = rows[i].sched.substr(rows[i].sched.length - 1)
            if(!isNaN(lastch)){
                sched = rows[i].sched.slice(0,-1)+' '+lastch
            }else{
                sched = rows[i].sched
            }
            if(rows[i].quantity == 0){
                funclist.push(rows[i].sched+':0')
            }else{
                funclist.push(rows[i].sched)
            }
            console.log(sched)
            nicelist.push(sched.charAt(0).toUpperCase()+sched.slice(1))

        }
        callback(funclist,nicelist)
    }
}
