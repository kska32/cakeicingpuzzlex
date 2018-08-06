
//----------------main entry-----------------
const fs = require('fs');

function readit(PslFilePath='Abc_StepNum_List.txt'){
        try{
                let data = fs.readFileSync(PslFilePath);
                let PslString = data.toString().replace(/'/gi,'\"');
                let PslJson = JSON.parse(PslString||"{}");
                return PslJson;
        }catch(err){
                return {};
        }
}

function writeit(PslJson,toFilePath='Abc_StepNum_List.txt',isAsync=false){
        if(!isAsync){
                try{
                        fs.writeFileSync( toFilePath, JSON.stringify(PslJson) );
                }catch(err){
                        return false;
                }
        }else{
                try{
                        fs.writeFile(toFilePath, JSON.stringify(PslJson),(err)=>{
                                if (err) throw err;
                        });
                }catch(err){
                        return false;
                }
        }
}

module.exports  = {readit,writeit};


//-----------------------------------------------------------------------



