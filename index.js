const express=module.require('express');
const app=new express();
const axios =module.require('axios');
const sqlite3=module.require('sqlite3');

// app.use(express.json());
app.use(express.static('public'));
app.set('view engine','ejs');

const mydb = new sqlite3.Database('./Mydb.db', err =>{
    if(err){
        return console.log(err.message);
    }
    console.log("Database Connected");
    app.listen(3000);
});

mydb.run("create table if not exists  data(name varchar(20) unique,last varchar(20),buy varchar(20),sell varchar(20),volume varchar(20),baseunit varchar(20))",(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('table created');
    }
});


axios.get('https://api.wazirx.com/api/v2/tickers')
        .then((data)=>{
            let keys=[];
            keys=Object.getOwnPropertyNames(data.data);
            
            for(let i=0;i<10;i++){
                mydb.run("insert into data values(?,?,?,?,?,?)",[data.data[keys[i]].name,data.data[keys[i]].last,data.data[keys[i]].buy,data.data[keys[i]].sell,data.data[keys[i]].volume,data.data[keys[i]].base_unit],(err)=>{
                    if(err){
                        // console.log(err);
                        i=20;
                    }
                    else{
                        console.log(`${i}th row inserted`);
                    }
                })
            }
        })
        .catch((err)=>{
            console.log(err);
        });

app.get('/',(req,res)=>{

    mydb.all("select * from data",(err,rows)=>{
        res.render('page1',{data:rows});
    })
})

