var database;
var UserModel;
var UserSchema;

var addUser = function(database, id, password, name, card_num, cvc, exp_m, exp_y, callback){
    console.log('adduser 호출됨.');
    
    var user = new database.UserModel({"id" : id, "password" : password, "name" : name, "card_num": card_num, "cvc" : cvc, "exp_m" : exp_m, "exp_y":exp_y});
    
    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log("사용자 데이터 추가함.");
        callback(null, user);
    });
};

var authuser = function(database, id, password, callback){
    console.log('authUser 호출됨');
    
    database.UserModel.findById(id, function(err,results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);
        
        if(results.length>0){
            console.log('아이디와 일치하는 사용자 찾음.');
            
            var user = new database.UserModel({id : id});
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
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

var userlogin = function(req, res){
    
    console.log('/process/userlogin 호출됨');
    var database = req.app.get('database');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(database.db){
        authuser(database, paramId, paramPassword, function(err,docs){
            if(err){throw err;}
            
        
            if(docs){
                req.session.user = {
                    id : paramId
                };
               res.redirect('liststore');
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
                res.write("<br><br><a href='/public/userlogin.html'>다시 로그인하기</a>");
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

var adduser = function(req, res){
    var database = req.app.get('database');
    console.log('/process/adduser 호출됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramCardnum = req.body.card_num || req.query.card_num;
    var paramCvc = req.body.cvc || req.query.cvc;
    var paramExp_y = req.body.exp_y || req.query.exp_y;
    var paramExp_m = req.body.exp_m || req.query.exp_m;
    
    if(database.db){
        addUser(database, paramId, paramPassword, paramName, paramCardnum, paramCvc, paramExp_y, paramExp_m, function(err,result){
            if(err){throw err;}
            
            
            if(result){
              
                console.dir(result);
                
                res.redirect('../public/userlogin.html');
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

var listuser = function(req, res){
    var database = req.app.get('database');
    console.log('/process/listuser 호출됨.');
    
    if(database.db){
        database.UserModel.findAll(function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            
            if(results){
                console.dir(results);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {results : results};
                req.app.render('listuser', context, function(err, html){
                    if(err) {throw err;}
                    res.end(html);
                });
        
        }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>사용자 리스트 조회 실패</h2>');
            res.end();    
            }
        });
    }
}


module.exports.userlogin = userlogin;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
