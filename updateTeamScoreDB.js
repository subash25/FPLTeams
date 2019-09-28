const gwResult  = require('./gameweekResultCalc');
// const { Client } = require('pg')
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'FPL',
//   password: 'chandriya125',
//   port: 5432,
// });

// currentGW = 6;
// leagueName = 'FL';
let updateCount= 0;
let resultCount = 0;
async function loadGWPointsData(league,gw,teamName,points,client){
    console.log('202020');
    
    console.log(updateCount);
    client
    .query('INSERT INTO public.gwpoints(league, gameweek, team,points) VALUES($1, $2, $3,$4)',
    [league, gw,teamName,points])
    .then(res => {
        updateCount = updateCount+1
        if(updateCount===20){
            console.log('processGWResult');
            gwResult.processGWResult(gw,league,client);
        }
      //console.log('inside loadGWPointsData');
      return res;
      
    })
    .catch(e => {console.error(e.stack)
      client.end();});
}



function checknsertGWPointsData(league,gw,teamName,points,client){
    console.log('191919');
    client.query('select count(*) from public.gwpoints where league =  $1 and gameweek =$2',[league,gw])
    .then(res=>{
        console.log(res.rows[0]);
        if(res.rows[0].count<1){
            loadGWPointsData(league,gw,teamName,points,client);
            console.log('dataloaded');
        }else{
            //client.end();
        }
        
    }).catch(e => {console.error(e.stack)
        client.end();});
}


function loadGWResultData(league,gw,team,result,gd,client){
    console.log('181818');
    client
    .query('INSERT INTO public.gwresults(league, gameweek, team,result,pointdiff) VALUES($1, $2, $3,$4,$5)',
    [league, gw,team,result,gd])
    .then(res => {
        resultCount=resultCount+1;
      console.log('resultCount'+resultCount);
      if(resultCount===20)
      client.end();
    })
    .catch(e => {console.error(e.stack)
      client.end();});
}

function checknsertGWResultsData(league,gw,team,result,gd,client){
    client.query('select count(*) from public.gwresults where league =  $1 and gameweek =$2',[league,gw])
    .then(res=>{
        console.log('171717');
        //console.log(res.rows[0]);
        if(res.rows[0].count<1){
            loadGWResultData(league,gw,team,result,gd,client);
            //console.log('dataloaded');
        }else{
            //client.end();
        }
        
    }).catch(e => {console.error(e.stack)
        client.end();});
}

module.exports.persistGWPoints =loadGWPointsData;
module.exports.persistGWResult =loadGWResultData;