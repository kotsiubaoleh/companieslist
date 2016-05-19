var express = require('express');
var mysql = require('mysql');

var router = express.Router();


var pool = mysql.createPool({
    connectionLimit: 10,
    host     : process.env['MYSQL_ADDON_HOST'],
    user     : process.env['MYSQL_ADDON_USER'],
    password : process.env['MYSQL_ADDON_PASSWORD'],
    database : process.env['MYSQL_ADDON_DB']
})

/* GET companies listing. */
router.get('/', function(req, res, next) {
    pool.query('SELECT * FROM companies', function(err, rows, fields) {
      if (err) {
          next(err);
      } else  {
          console.log(rows);
          res.json(rows);  
      }
    });
});

/* Add new company. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    pool.query('INSERT INTO companies (name, earnings, parent) VALUES (?,?,?)', 
    [req.body.name, req.body.earnings, req.body.parent], function(err, results){
        if (err) {
            next(err);
        } else {
            res.json({success: true})
        }
    });
});

/* DELETE company. */
router.delete('/:id', function(req, res, next) {
    pool.query('SELECT * FROM companies WHERE parent = ?', 
    [req.params.id,], function(err, results){
        if (err) {
            next(err);
        } else {  
            if (results.length) next(new Error('Can\'t delete company which have child companies'));
            else {
                pool.query('delete from companies where id = ?',
                [req.params.id], function (err, results) {
                    if (err) {
                        next(err);
                    } else {
                        res.json({success: true})
                    }
                }); 
            }
        }
    });
});

/* Edit company. */
router.put('/:id', function(req, res, next) {
    pool.query('UPDATE companies SET name = ?, earnings = ? WHERE id = ?', 
    [req.body.name, req.body.earnings, req.params.id], function (err, results) {
        if (err) {
            next(err);
        } else {
            res.json({success: true})
        }
    });
});

router.use(function (err, req, res, next) {
    console.error(err);
    res.status(500);
    res.json({success: false});
});


module.exports = router;
