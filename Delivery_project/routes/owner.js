var mongoose = require('mongoose');
var database;
var OwnerModel;
var OwnerSchema;

var addOwner = function(database, id, password, name, store_name, store_img, info, callback){
    console.log('addOwner 호출됨.');
    
    var owner = new database.OwnerModel({"id" : id, "password" : password, "name" : name, "store_name" : store_name, "store_img" : store_img, "info" : info});
    
    owner.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log("Owner 데이터 추가함.");
        callback(null, owner);
    });
};

var authOwner = function(database, id, password, callback){
    console.log('authOwner 호출됨');
    
    database.OwnerModel.findById(id, function(err,results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);
        
        if(results.length>0){
            console.log('아이디와 일치하는 사용자 찾음.');
            
            var owner = new database.OwnerModel({id : id});
            var authenticated = owner.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            if(authenticated){
                console.log('비밀번호 일치함');
                callback(null, results);
            }else{
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
            
        }else{
            console.log("아이디와 일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }
    });
};

var ownerlogin = function(req, res){
    
    console.log('/process/ownerlogin 호출됨');
    var database = req.app.get('database');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.id;
    
    if(database.db){
        authOwner(database, paramId, paramPassword, function(err,docs){
            if(err){throw err;}
            
            
            if(docs){
                var ownername = docs[0].name;
                console.dir(docs);
                
                req.session.owner = {id : paramId}
                
               
                res.redirect('ownerview');
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
                res.write("<br><br><a href='/public/ownerlogin.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end()
    }
}

var addowner = function(req, res){
    var database = req.app.get('database');
    console.log('/process/addowner 호출됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramStoreName = req.body.store_name || req.query.store_name;
    var paramStoreImg = req.body.store_img || req.query.store_img;
    var paramInfo = req.body.info || req.query.info;
    
    
    if(database.db){
        addOwner(database, paramId, paramPassword, paramName, paramStoreName, paramStoreImg, paramInfo, function(err,result){
            if(err){throw err;}
            
            
            if(result){
              
                console.dir(result);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 되었습니다.</h2>');
                res.write("<br><br><a href='/public/ownerlogin.html'>로그인 하러가기</a>");
                res.end();
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end()
    }
}

module.exports.ownerlogin = ownerlogin;
module.exports.addowner = addowner;
