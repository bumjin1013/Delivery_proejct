var database;
var UserModel;
var UserSchema;


var addcart = function(req, res){
    console.log('addcart 호출됨.');
    
    var paramStoreName = req.body.store_name || req.query.store_name;
    var paramMenuName = req.body.menu_name || req.query.menu_name;
    var paramPrice = req.body.price || req.query.price;
    var paramNum = req.body.num || req.query.num;

    var database = req.app.get('database');


    if (database.db) {
        database.UserModel.findOneAndUpdate({id:req.session.user.id},                         
            {'$push': {'cart':{'store_name':paramStoreName, 'menu_name':paramMenuName, 'price':paramPrice, 'num':paramNum}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('메뉴 추가중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>장바구니 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }

                    console.log("장바구니 데이터 추가함.");
                    console.log('장바구니 작성', '장바구니 추가하였습니다. : ' + req.session.user.id);
            
                    });
                } else {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>데이터베이스 연결 실패</h2>');
                    res.end();
	           }
    
}

var listcart = function(req, res){
    var database = req.app.get('database');
    console.log('/process/listcart 호출됨.');
    if(database.db){
        database.UserModel.findOne({id : req.session.user.id}, function(err, incart){ //점주의 메뉴 리스트 화면
            if(err){
                callback(err, null);
                return;
            }
            
            if(incart){
                console.dir(incart);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {incart : incart};
                req.app.render('listcart', context, function(err, html){
                    if(err) {throw err;}
                    res.end(html);
                });
        
        }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>장바구니 조회 실패</h2>');
            res.end();    
            }
        });
    }
    
}

var deletecart = function(req, res){
    console.log('addcart 호출됨.');
    
    var database = req.app.get('database');

    if (database.db) {
        database.UserModel.findOneAndUpdate({id:req.session.user.id},                         
            {'$pull': {'cart' : {}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('장바구니 삭제중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>장바구니 삭제 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }

                    
                    console.log("장바구니 데이터 삭제함.");
                    console.log('장바구니 삭제', '장바구니 삭제하였습니다. : ' + req.session.user.id);
                    });
                } else {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>데이터베이스 연결 실패</h2>');
                    res.end();
	           }
    
}

module.exports.addcart = addcart;
module.exports.listcart = listcart;
module.exports.deletecart = deletecart;