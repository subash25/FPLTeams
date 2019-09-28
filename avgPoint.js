const axios = require('axios');
// const { Client } = require('pg')
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'FPL',
//   password: 'chandriya125',
//   port: 5432,
// });
const avgPointURL = 'https://fantasy.premierleague.com/api/bootstrap-static/';
// let GWNumber = 6;
// let league = 'FL';
//exports.fetchAvg= async function getAvgPts(){
    async function getAvgPts(gw){
const response= await axios(avgPointURL);
//console.log(response.data.events[GWNumber-1].average_entry_score);
//const dataOut = Promise.resolve(response);
//console.log(dataOut);
return response.data.events[gw-1].average_entry_score;
}

function loadAvgPts(gw,points,league,con){
    con
    .query('INSERT INTO public.utility(key, value, param) VALUES($1, $2, $3)',
    [gw, points,league])
    .then(res => {
      console.log('inside loadAvgPts');
      //client.end();
    })
    .catch(e => {console.error(e.stack)
        con.end();});
}

let checkAndLoad =  function (gw,points,league,con){
    con.query("select count(*) from public.utility where param =  $1 and key =$2",[league,gw])
    .then(res=>{
        console.log('88888');
        console.log(res.rows[0]);
        if(res.rows[0].count<1){
            loadAvgPts(gw,points,league,con);
            console.log('dataloaded');
        }else{
            //con.end();
        }
        
    }).catch(e => {console.error(e.stack)
        con.end();});
}

let getGWAverage = async function (gw,con,league){
    let avgPoints
    console.log('7777');
    getAvgPts(gw).then((data)=>{
    //console.log('Avg Points --'+data);

     checkAndLoad(gw,data,league,con);
     avgPoints = data;
    return avgPoints;
});
return avgPoints;
}
//client.connect();
exports.getGWAverageDB=getGWAverage;
exports.getAvgPtsURL = getAvgPts;

// getGWAverage(GWNumber,client,'FL').then(()=>{
//     setTimeout(() => {
//         //client.end();
//     }, 100);
// });
