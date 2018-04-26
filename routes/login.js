var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('login');
	
	console.log('login');
//var mysql = require('mysql');        
//	    
//	//创建连接    
//	var client = mysql.createConnection({    
//	  "host":"127.0.0.1",
//	  "port":"3306",
//	  "user":"root",
//	  "password":""
//	});    
//	  
//	var database = 'mysql';
//	var table = 'table';
//	
//	  
//	client.query("use " + database);  
//	  
//	client.query(    
//	  'select * from '+ table,    
//	  function selectCb(errs, results, fields) {    
//	    if (errs) {    
//	      throw err;    
//	    }    
//	        
//	      if(results)  
//	      {  
//	          console.log(results);
//	      }      
//	       
//	  });   
});

module.exports = router;
