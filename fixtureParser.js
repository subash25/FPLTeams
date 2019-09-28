const axios = require('axios');
const { Client } = require('pg')
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'FPL',
//   password: 'chandriya125',
//   port: 5432,
// });
// currentGW = 5;
// leagueName = 'FL';
fixtureURL = "https://footballapi.pulselive.com/football/fixtures?comps=1&teams=1,2,127,131,43,4,6,7,26,10,11,12,23,14,18,20,21,33,25,38&compSeasons=274&page=0&pageSize=400";

async function getFixturesAndLoad (leagueName,currentGW,client){
    console.log('55555');
    const response = await axios(fixtureURL);

    //const fixtureData = response.data.content[1].gameweek.gameweek;
    //console.log(response.data.content[1].teams);
    response.data.content.map((fixtures)=>{
if(fixtures.gameweek.gameweek===currentGW){
    //console.log(`${fixtures.teams[0].team.name}  vs ${fixtures.teams[1].team.name}`);
    loadData(leagueName, currentGW, fixtures.teams[0].team.name, fixtures.teams[1].team.name,client);
}
    }
    );
    
}
function loadData(league,gw,homeTeam,awayTeam,client){
    console.log('66666');
    client
    .query('INSERT INTO public.fixturetable(league, gameweek, hometeam,awayteam) VALUES($1, $2, $3,$4)',
    [league, gw,homeTeam,awayTeam])
    .then(res => {
      //console.log('inside loaddata');
      
    })
    .catch(e => {console.error(e.stack)
      client.end();});
}
// client.connect();
// getFixtures().then(()=>{
//     console.log('promise resolved');
//     setTimeout(()=>{
//         console.log('test test test');
//         client.end();
//     },100)
// });

function checkInsertFixtureData(league,gw,client){
    client.query('select count(*) from public.fixturetable where league =  $1 and gameweek =$2',[league,gw])
    .then(res=>{
        console.log(res.rows[0]);
        if(res.rows[0].count<1){
            getFixturesAndLoad(league,gw,client);
            //console.log('dataloaded');
        }else{
            //client.end();
        }
        
    }).catch(e => {console.error(e.stack)
        client.end();});
}

exports.getFixturesDB = getFixturesAndLoad;