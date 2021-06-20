var database;
var UserModel;
var UserSchema;

var OwnerModel;
var OwnerSchema;


var order = function(req, res){
    var database = req.app.get('database');
    console.log('/process/order 호출됨.');
    if(database.db){
        database.UserModel.findOne({id : req.session.user.id}, function(err, results){ //현재 session id의 db에 저장
            if(err){
                callback(err, null);
                return;
            }
            
            if(results){
                console.dir(results);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {results : results};
                req.app.render('order', context, function(err, html){
                    if(err) {throw err;}
                    res.end(html);
                });
        
        }else{
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>주문 실패</h2>');
            res.end();    
            }
        });
    }
    
}

var ordersuccess = function(req, res){
    console.log('ordersuccess 호출됨.');
    
    
    var paramAddress = req.body.address || req.query.address;
    var paramPhonenum = req.body.phonenum || req.query.phonenum;
    var paramForOwner = req.body.forOwner || req.query.forOwner;
    var paramForRider = req.body.forRider || req.query.forRider;
    var paramFinalPrice = req.body.final_price || req.query.final_price;
    var paramStorename = req.body.store_name || req.query.store_name;
    var paramMenulist = req.body.menu_list || req.query.menu_list

    var database = req.app.get('database');


    if (database.db) {

        database.UserModel.findOneAndUpdate({id:req.session.user.id}, //세션 사용하여 로그인한 사용자의 아이디 추가하여야함
            {'$push': {'order':{'menu_list': paramMenulist, 'address':paramAddress, 'phonenum':paramPhonenum,'forOwner':paramForOwner, 'forRider':paramForRider, 'final_price':paramFinalPrice, 'store_name':paramStorename}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('주문 추가중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>주문 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
        });
        
         database.OwnerModel.findOneAndUpdate({store_name:paramStorename}, //세션 사용하여 로그인한 사용자의 아이디 추가하여야함
            {'$push': {'order':{'orderID' : req.session.user.id, 'menu_list': paramMenulist, 'address':paramAddress, 'phonenum':paramPhonenum,'forOwner':paramForOwner, 'forRider':paramForRider, 'final_price':paramFinalPrice}}},
            {'new':true, 'upsert':true},
            function(err, results) {
                if (err) {
                    console.error('주문 추가중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>주문 추가 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }
         });
        
            res.redirect('userorderlist');
                } else {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>데이터베이스 연결 실패</h2>');
                    res.end();
	           }
    
    
    
    
};

var userorderlist = function(req, res){
    var database = req.app.get('database');
    console.log('/process/userorderlist 호출됨.');
    
    if(database.db){
        database.UserModel.findOne({id : req.session.user.id}, function(err, results){ //점주의 메뉴 리스트 화면
            if(err){
                callback(err, null);
                return;
            }
            
            if(results){
                console.dir(results);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
                var context = {results : results};
                req.app.render('userorderlist', context, function(err, html){
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


module.exports.order = order;
module.exports.ordersuccess = ordersuccess;
module.exports.userorderlist = userorderlist;
