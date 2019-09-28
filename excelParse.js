
var xlsx = require('node-xlsx');
// const { Client } = require('pg')
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'FPL',
//   password: 'chandriya125',
//   port: 5432,
// });
//const connectionString = 'postgres://postgres:admin@localhost:5432/FPL';
league = 'FL';
const gwNo = 5;
let captainSubJSObject = {

};
var obj = xlsx.parse('C:\\Users\\raj kumar\\Documents\\CaptainSubDoc.xlsx');
//var workbook = XLSX.readFile('C:\\Users\\raj kumar\\Documents\\CaptainSubDoc.xlsx');
var dataObj = obj[0].data;
// var newDataObj =[];
// for(data in dataObj){
// if(dataObj[data].length>0){
//     newDataObj.push(dataObj[data]);
// }
// }
let temp = '';
let captainSubJSON;
//console.log('direct convert'+JSON.stringify(dataObj))
for(i in dataObj){
 temp = '';
    if(dataObj[i].length>0){
        
        for(j in dataObj[i]){
            //console.log(dataObj[i][1])
            if(dataObj[i][Number.parseInt(j)+1]){
                //console.log('test'+dataObj[i][Number.parseInt(j)+1])
                if(temp===''){
                    temp = dataObj[i][Number.parseInt(j)+1];
                    //console.log(`team if ${temp}`)
                }
                
                else{
                    if(dataObj[i][Number.parseInt(j)+1]){
                        //console.log(`above else ${temp}`);
                    temp = temp+ ','+ dataObj[i][Number.parseInt(j)+1];
                    ///console.log(`team else${temp}`)
                    }
                }
                
            }
            
        }
        //console.log('final temp '+temp)
        captainSubJSObject[dataObj[i][0]] = temp;
        
    }
    }
// console.log(newDataObj);
//exports.captainsubs= newDataObj;
//console.log('captainSubJSON'+JSON.stringify(captainSubJSObject));
//captainSubJSON = JSON.stringify(captainSubJSObject);
captainSubJSON = JSON.stringify(dataObj);
//let parsedData = JSON.parse(captainSubJSON)
//console.log('parsed data'+parsedData[0][0])
//client.connect();

    //client.query("select count(*) from public.captainsubtable where league =  $1 and gameweek =$2",[constLeague,gameweekNo])
    let checkAndLoad = function (constLeague,gameweekNo,con){
        console.log('121212');
    con.query("select count(*) from public.captainsubtable where league =  $1 and gameweek =$2",[constLeague,gameweekNo])
    .then(res=>{
        //console.log(res.rows[0]);
        if(res.rows[0].count<1){
            loadData(constLeague,gameweekNo,con);
            //console.log('dataloaded');
        }else{
            //con.end();
        }
        
    }).catch(e => {console.error(e.stack)
        con.end();});
}
 
function loadData(leagueName,gw,con){
    con
    .query('INSERT INTO public.captainsubtable(league, gameweek, data) VALUES($1, $2, $3)',[leagueName, gw,captainSubJSON])
    .then(res => {
      console.log('inside loaddata')
      //con.end();
    })
    .catch(e => {console.error(e.stack)
        con.end();});
}


  let fetchCaptainSubDataFromDB = async function(gw,league,client) {
    let returnValue;
    console.log('10101010');
    await checkAndLoad(league,gw,client);
    console.log('In Fetching  captainSubData');
    // Select all rows in the table
     await client.query('SELECT data FROM public.captainsubtable where gameweek = $1 and league = $2',[gw,league])
    .then(data=> {
      let result = data.rows[0].data;
    
    //console.log('Team'+ JSON.stringify(result)); 
    returnValue = result;
    //returnValue= data.rows[0].data;
    
    }).catch(err=>{
      //console.log(err);
    });
    return returnValue;
  }
  

exports.gwCaptainSubDataFromDB = fetchCaptainSubDataFromDB;
exports.checkAndLoad = checkAndLoad;
//checkAndLoadcheckAndLoad(league,gwNo,client);