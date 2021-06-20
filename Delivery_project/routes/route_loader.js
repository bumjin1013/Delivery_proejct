var route_loader = {};
var config = require('../config');
var user = require('./user'),
    owner = require('./owner'),
    store = require('./store'),
    cart = require('./cart'),
    order = require('./order');

                    
route_loader.init = function(app, router) {
	console.log('route_loader.init 호출됨.');
	
    return initRoutes(app, router);
}




function initRoutes(app, router) {

	var infoLen = config.route_info.length;
	console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);
 
	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];
		var curModule = require(curItem.file);
		console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);
        
		router.route('/process/listuser').post(user.listuser);
        router.route('/process/userlogin').post(user.userlogin);
        router.route('/process/adduser').post(user.adduser);
        router.route('/process/userorderlist').get(order.userorderlist);
        router.route('/process/addcart').post(cart.addcart);
        router.route('/process/listcart').get(cart.listcart);
        router.route('/process/deletecart').post(cart.deletecart);
        router.route('/process/ownerlogin').post(owner.ownerlogin);
        router.route('/process/addowner').post(owner.addowner);
        router.route('/process/addmenu').post(store.addmenu);
        router.route('/process/deletemenu').post(store.deletemenu);
        router.route('/process/liststore').get(store.liststore);
        router.route('/process/ownerview').get(store.ownerview);
        router.route('/process/userview').get(store.userview);
        router.route('/process/review').post(store.review);
        router.route('/process/order').post(order.order);
        router.route('/process/ordersuccess').post(order.ordersuccess);
		console.log('라우팅 모듈 [%s] 설정됨.', curItem.method);
        
	}
    
    app.use('/', router);
}

module.exports = route_loader;