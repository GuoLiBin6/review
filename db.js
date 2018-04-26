function longTimeOperation(callback){

  console.log('this is a longTimeOperation');

  var delay=parseInt((Math.random()*10000000)%5000);

  setTimeout(function(){

    console.log('the longTimeOperation cost '+delay+'ms');



  },delay);
    callback();

}



function f2(){

  console.log('this is f2');

}



longTimeOperation(f2);