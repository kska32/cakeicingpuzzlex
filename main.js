 //======================================
 //      Cake Icing Puzzle
 //         Problem 566
 //
 //=======================================

 const Abc_StepNum_List_Path = './Abc_StepNum_List.txt';
 const {readit,writeit} = require('./textIO.js');
 
 function cakeGame(){
     // plus means the piece of cake is icing-up
     // minus means the piece ... is ...down.
     // cake = +360 denotes icing-up-100%, and it's normal state.'
     // cake = -360  denotes icing-down-100%
     // so the total Sum range must be -360 ~ +360 degress. right?
     // need to know the flip-action is whether flipToDownside xor flipToUpside。
         let cakeSize=0;
         let piece = [];
         let $step = 0;//总次总和
         let $oneCakeStep = 0;//单总和
         let positivePiece = 1;
 
         let Abc_StepNum_List = readit(Abc_StepNum_List_Path);
 
         let times = 10000;
         let getPiece = (a,b,c) =>{
             cakeSize = a * b * c * times ;// (a*b*c)/360
             return cakeSize;
         } 
         let getA = (a,b,c)=> b * c * times ;//(a*b*c)
         let getB = (a,b,c)=> a * c * times ;//(a*b*c)
         let getC = (a,b,c)=> a * b * (Math.round(Math.sqrt(c)*times)) ; //(a*b*c)
     //===============================================================
 
         let piecesFlip = (start,count=1)=>{//flips mutilple pieces of cake
             // reverse and flip partially
             switch(count){
                 case 0: return true;
                 case 1: piece[start] = -piece[start]; 
                         positivePiece = piece[start]>0 ? positivePiece+1 : positivePiece-1;
                         return true;
             }
             let head = piece.slice( 0, start );
             let tail = piece.slice( start + count );
             let body = piece.splice( start, count );
                 body = body.reverse();//body reverse
                 for(let i=0; i<body.length; i++){
                     body[i] = -body[i];
                     body[i]>0 ? positivePiece++ : positivePiece--;
                 }
                 piece = head.concat(body).concat(tail);
             return true;
         }
         let cakeRotateToLeft = (steps=1,arr=piece)=>{ 
             for(let i=0; i<steps; i++){
                 arr.push(arr.shift()); 
             }
         }
         let cakeRotateToRight = (steps=1,arr=piece)=>{//
             for(let i=0; i<steps; i++){
                 arr.splice(0,0,arr.pop()); 
             }
         } 
         let checkAbsSum = ()=>{ 
             return piece.reduce((pre,cur)=>Math.abs(pre)+Math.abs(cur)); 
         }
         //计算需要向右旋转的准确步数
         let getNumbersToRightSteps = (inSectorAngle)=>{
                     let copypiece = piece.slice();//复制一下蛋糕，我想要一模一样的整块蛋糕。
                     cakeRotateToLeft(1,copypiece);
                         //副本向左旋转，因为全部在末尾整齐排列后，便于遍历。
                     let stepsToNeedInfo = {
                         stepsNum:0,//计算需要旋转的步数
                         thatStepsDistance:0,//总步数相对应的距离（unit:degree)
                         isEqual:false // false means bigger(that has some surplus)
                     };
 
                     let info = stepsToNeedInfo;
                     for(let i=copypiece.length-1; i>=0; i--){
                             //可能的结果: 
                             //有可能 1. 刚好相等
                             //有可能 2. 前者较大，大于切入块的大小, 这个是常态
                         if(info.thatStepsDistance < inSectorAngle){
                             info.thatStepsDistance += Math.abs(copypiece[i]);
                             info.stepsNum++;
                         } else if(info.thatStepsDistance === inSectorAngle){
                             info.isEqual = true;//因为默认是false，所以只需要这样。
                             break;
                         } else {
                             break;
                         }
                     }
                     return stepsToNeedInfo;
         }
         //-----------------------
         let divide = (inSectorAngle)=>{        
                 if( Math.abs(piece[0]) > inSectorAngle ){
                         var inSector = piece[0]>0 ? -inSectorAngle : inSectorAngle;
                         
                         var outSector = Math.abs(piece[0]) - Math.abs(inSectorAngle);
                             outSector = piece[0]>0 ? outSector : -outSector;
 
                         piece.splice(0, 1, outSector, inSector);  
                         inSector>0 ? positivePiece++ : null;          
                 }
                 else if( Math.abs(piece[0]) < inSectorAngle){
                         //要切的切块 大于 当前切块时
                         let stepsToNeed = getNumbersToRightSteps(inSectorAngle);
                         cakeRotateToRight(stepsToNeed.stepsNum-1);
                         //if(stepsToNeed.isEqual){
                         //    cakeRotateToRight();
                         //}else{
                             //console.log(stepsToNeed.isEqual);
                             let sectorOut = stepsToNeed.thatStepsDistance;
                                 sectorOut = sectorOut - inSectorAngle;
                                 sectorOut = piece[0]>0 ? sectorOut : -sectorOut;
                                 
                             let sectorIn = Math.abs(piece[0]) - Math.abs(sectorOut);
                                 sectorIn = piece[0]>0 ? sectorIn : -sectorIn;
 
                             piece.splice(0, 1, sectorOut, sectorIn);
                             sectorOut>0 ? positivePiece++ : null;
                         //}        
                         //console.log("反转索引头: ",1,", 索引尾: ",1+stepsToNeed);
                         piecesFlip(1, stepsToNeed.stepsNum);//1代表切块外面部分。
                 }else{
                         //要切的切块与之前切出来的切块刚好吻合时。
                         //因为没有 产生的新的切块 所以向👉旋转，为下次做准备
                         piece[0] = -piece[0];
                         piece[0]>0 ? positivePiece++ : positivePiece--;
                         cakeRotateToRight();
                 }
                 while( piece[0]===0 ){
                         //要切的切块 大于 当前切块时 有一定几率会出现零大小切块
                         piece.shift();
                         cakeRotateToRight();
                 }
                 $step++;
                 $oneCakeStep++;
                 //console.log("...."+piece);
                 return piece.length === positivePiece;//checkIcingIsUp() ;// $step >= $maxSteps;
         }
 
         function startCompute(G=14, M=11, callback=()=>{}){
             //G(11)=60.. c=11
             //F(a,b,c) &&  9 <= a < b < c <= n
             //G(n) n >=c > b > a >= 9
             for(let ic=G; ic>=M; ic--){
                 for(let ib=ic-1; ib>=10; ib--){
                     for(let ia=ib-1; ia>=9; ia--){
                         piece = [getPiece(ia, ib, ic)];//初始化
                         let psl = Abc_StepNum_List;
                         let same10times = {};//same length +1, otherwise reset lengthField
                         let abc = 'a'+ia+'-b'+ib+'-c'+ic;
                         let outputFileName = `./Abc_StepNum_List_G${G}_M${M}.txt`;
                         while(true){
                                 //console.log(`Current State:${$step}, F(${ia},${ib},${ic}), Len:${piece.length}---${ new Date().toLocaleTimeString() }`);
                                 if( divide(getA(ia,ib,ic)) ){
                                     
                                         if(!psl[abc]){
                                             psl[abc] = $oneCakeStep;
                                             writeit(psl,outputFileName);
                                         }
                                         callback($step,$oneCakeStep,ia,ib,ic,piece,positivePiece,Abc_StepNum_List);
                                         positivePiece = 1;
                                         $oneCakeStep = 0;
                                         break;
                                         
                                 }
                                 if( divide(getB(ia,ib,ic)) ){
                                         if(!psl[abc]){
                                             psl[abc] = $oneCakeStep;
                                             writeit(psl,outputFileName);
                                         }
                                         callback($step,$oneCakeStep,ia,ib,ic,piece,positivePiece,Abc_StepNum_List);                           
                                         positivePiece = 1;
                                         $oneCakeStep = 0;
                                         break;
                                 }
                                 if( divide(getC(ia,ib,ic)) ){
                                     
                                         if(!psl[abc]){
                                             psl[abc] = $oneCakeStep;
                                             writeit(psl,outputFileName);
                                         }
                                         callback($step,$oneCakeStep,ia,ib,ic,piece,positivePiece,Abc_StepNum_List);
                                         positivePiece = 1;
                                         $oneCakeStep = 0;
 
                                         break;
                                         
                                 }
 
                                 //search from abc-stepNum dictionary table
                                 if(same10times[abc] === 'Newest'){
                                     if(!($step%100)){
                                         console.log(`StepNum:${$step}, F(${ia},${ib},${ic}), Len:${piece.length}---${ new Date().toLocaleTimeString() }`);
                                     }
                                         continue;
                                 }else if(same10times[abc] === undefined){
                                         same10times[abc] = 0;
                                 }else{
                                         same10times[abc]++;
                                         if(same10times[abc] >= 10){
                                             if(psl[abc]){
                                                 $step += psl[abc] - $oneCakeStep;
                                                 positivePiece = 'OK';
                                                 $oneCakeStep = piece.length = 0;
                                                 callback($step,$oneCakeStep,ia,ib,ic,piece,positivePiece,Abc_StepNum_List);
                                                 positivePiece = 1;
                                                 $oneCakeStep = 0;
                                                 break;
                                             }else{
                                                 same10times[abc] = 'Newest';
                                             }
                                         }
                                 }
                         }
                     }
                 }
             }
             return $step;
         }
         let gameObj = {};
             gameObj.play = startCompute;
             return gameObj;
 }
 
 //================================================
 function oneThread(G=14,M=11){
         let myCake = cakeGame();
         let theFinalSum = myCake.play(G,M,(step,oneCakeStep,a,b,c,piece,positivePeace,Abc_StepNum_List)=>{
             console.log(`KeyStep:${step}, oneCakeStep:${oneCakeStep}, F(${a},${b},${c}), Len:${piece.length}, positiveLen:${positivePeace} --- ${ new Date().toLocaleTimeString() }`
             );
         });
         return theFinalSum;
 }
 
 
 function multipleThread(gx){
         let lst =[ [ gx,11 ]];
         //[ [53,48],[47,41],[40,33],[32,24],[23,11] ];
         //분산처리하기
         let totalSum = 0 ;
         let threadState = 0;
 
         let startTime = Date.now();
         let promise = new Promise((resolve)=>{
                 lst.map((v)=>{
                     setTimeout(()=>{
                         totalSum += oneThread(v[0],v[1]);
                         threadState++;
                         if(threadState == lst.length){
                             resolve();
                         }
                     });
                 });
         });
 
         promise.then(()=>{
                 let elapsed = Date.now()-startTime;
                 console.log("The Final Sum: ", totalSum);
                 console.log("Elapsed Time: ", elapsed+' ms');
         });
 }
 
 
 let Gx = 17;
 multipleThread(Gx);
 
 //it's failed to compute the final sum...! because of the irrational number.