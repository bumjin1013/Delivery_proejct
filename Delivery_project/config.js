module.exports = {
    server_port : 3000,
    db_url : 'mondogb://localhost:27017/R07_07',
    
    db_schemas: [
        {file:'./user_schema', collection:'users', schemaName:'UserSchema',modelName:'UserModel'},
        {file:'./owner_schema', collection:'owners', schemaName:'OwnerSchema',modelName:'OwnerModel'},
    ],
    
    route_info : [
        {file : './user', path : '/process/userlogin', method : 'login', type : 'post'},
        {file : './user', path : '/process/adduser', method : 'adduser', type : 'post'},
        {file : './user', path : '/process/listuser', method : 'listuser', type : 'post'},
        {file : './order', path : '/process/userorderlist', method : 'userorderlist', type : 'get'},
        {file : './cart', path : '/process/addcart', method : 'addcart', type : 'post'},
        {file : './cart', path : '/process/listcart', method : 'listcart', type : 'get'},
        {file : './cart', path : '/process/deletecart', method : 'deletecart', type : 'post'},
        {file : './owner', path : '/process/ownerlogin', method : 'login', type : 'post'},
        {file : './owner', path : '/process/addowner', method : 'adduser', type : 'post'},
        {file : './store', path : '/process/addmenu', method : 'addmenu', type : 'post'},
        {file : './store', path : '/process/deletemenu', method : 'deletemenu', type : 'post'},
        {file : './store', path : '/process/liststore', method : 'liststore', type : 'get'},
        {file : './store', path : '/process/ownerview', method : 'ownerview', type : 'get'},
        {file : './store', path : '/process/userview', method : 'userview', type : 'get'},
        {file : './store', path : '/process/review', method : 'review', type : 'post'},
        {file : './order', path : '/process/order', method : 'order', type : 'post'},
        {file : './order', path : '/process/ordersuccess', method : 'ordersuccess', type : 'post'}
    ]
}

