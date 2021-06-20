var database;
var OwnerModel;
var OwnerSchema;


var liststore = function(req, res){
    var database = req.app.get('database');
    console.log('/process/liststore 호출됨.');
    var curStoreName;
    
    if(database.db){
        database.OwnerModel.findAll(function(err, owners){ //점주가 가입할 때 입력한 img의 경로와 가게 이름 사용
            if(err){
                callback(err, null);
                return;
            }
            
            if(owners){
                console.dir(owners);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {owners : owners};
                req.app.render('liststore', context, function(err, html){
                    if(err) {throw err;}
                    res.end(html);
                });
        
        }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>가게 조회 실패</h2>');
            res.end();    
            }
        });
    }
}

var ownerview = function(req, res){
    var database = req.app.get('database');
    console.log('/process/listmenu 호출됨.');
    
    if(database.db){
        database.OwnerModel.findOne({id : req.session.owner.id}, function(err, results){ //점주의 메뉴 리스트 화면
            if(err){
                callback(err, null);
                return;
            }
            
            if(results){
                console.dir(results);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {results : results};
                req.app.render('ownerview', context, function(err, html){
                    if(err) {throw err;}
                    res.end(html);
                });
        
        }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>가게 조회 실패</h2>');
            res.end();    
            }
        });
    }
    
}

var userview = function(req, res){
    var database = req.app.get('database');
    console.log('/process/userview 호출됨.');
    
    
    var paramStoreName = req.body.storename || req.query.storename;
    console.log(paramStoreName);
    
    if(database.db){
        database.OwnerModel.findOne({store_name : paramStoreName}, function(err, results){ //고객의 메뉴 리스트 화면
            if(err){
                callback(err, null);
                return;
            }

         
            if(results){
                
                console.dir(results);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {results : results};
                req.app.render('userview', context, function(err, html){
                    if(err) {throw err;}
                    res.end(html);
                });
        
        }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>가게 조회 실패</h2>');
            res.end();    
            }
        });
    }
}

var review = function(req, res){
    console.log('store모듈 안에 있는 review 호출됨.');
    
    
    var paramStoreName = req.body.store_name || req.query.store_name;
    var paramContents = req.body.contents || req.query.contents;
    var paramStar = req.body.star || req.query.star;

    var database = req.app.get('database');


    if (database.db) {
        database.OwnerModel.findOneAndUpdate({store_name: paramStoreName}, //세션 사용하여 로그인한 사용자의 아이디 추가하여야함
            {'$push': {'review':{'writer':req.session.user.id, 'contents':paramContents, 'star':paramStar}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('리뷰 추가중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>리뷰 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
            
                    res.redirect('back');

                    console.log("리뷰 데이터 추가함.");
                    console.log('리뷰 작성', '리뷰 추가하였습니다. : ' + paramStoreName);

                    });
                } else {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>데이터베이스 연결 실패</h2>');
                    res.end();
	           }
}

var addmenu = function(req, res){
    console.log('owner모듈 안에 있는 addmenu 호출됨.');
    
    
    var paramMenuName = req.body.menu_name || req.query.menu_name;
    var paramPrice = req.body.price || req.query.price;
    var paramMenuImg = req.body.menu_img || req.query.menu_img;

    var database = req.app.get('database');


    if (database.db) {
        database.OwnerModel.findOneAndUpdate({id:req.session.owner.id}, //세션 사용하여 로그인한 사용자의 아이디 추가하여야함
            {'$push': {'menu':{'menu_name':paramMenuName, 'price':paramPrice, 'menu_img':paramMenuImg}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('메뉴 추가중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>메뉴 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }

                    console.log("메뉴 데이터 추가함.");
                    console.log('메뉴 작성', '메뉴 추가하였습니다. : ' + req.session.owner.id);


                    });
                } else {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>데이터베이스 연결 실패</h2>');
                    res.end();
	           }

    };

var deletemenu = function(req, res){
    console.log('owner모듈 안에 있는 deletemenu 호출됨.');
    
    
    var paramMenuName = req.body.menu_name || req.query.menu_name;

    var database = req.app.get('database');


    if (database.db) {
        database.OwnerModel.findOneAndUpdate({id:req.session.owner.id}, //세션 사용하여 로그인한 사용자의 아이디 추가하여야함
            {'$pull': {'menu':{'menu_name':paramMenuName}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('메뉴 추가중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>메뉴 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }

                    console.log("메뉴 데이터 삭제함.");
                    console.log('메뉴 삭제', '메뉴 삭제하였습니다. : ' + paramMenuName);
                    res.redirect('ownerview');

                    });
                } else {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>데이터베이스 연결 실패</h2>');
                    res.end();
	           }
}


module.exports.liststore = liststore;
module.exports.ownerview = ownerview;
module.exports.userview = userview;
module.exports.deletemenu = deletemenu;
module.exports.review = review;
module.exports.addmenu = addmenu;
module.exports.deletemenu = deletemenu;
