var mongoose = require('mongoose');

var database = {};

database.init = function(app, config){
    console.log('init 함수 호출됨 ');
    
    connect(app, config);
}

function connect(app, config){
    console.log('connect 함수 호출됨')
    
    var databaseUrl = 'mongodb://localhost:27017/R10_07';
    console.log('....db에 연결합니다. ');
    mongoose.promise = global.promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'mongoose 연결 error'));
    database.on('open', function () {
        console.log('db에 연결됬습니다. :' + databaseUrl);

        createSchema(app,config);
    });
    database.on('disconnected', function () {
        console.log('연결 끊어짐. 5초후 다시 연결합니다');
        setInterval(connectDB, 5000);
    });
    app.set('database', database);
}

function createSchema(app, config){ 
    var schemaLen =  config.db_schemas.length
    console.log('config에 정의된 스키마 수 : '+ schemaLen);
    
    for(var i = 0;i<schemaLen;i++){
        var curItem = config.db_schemas[i];
        
        if(curItem.schemaName == 'Temp_UserSchema'){
            var curSchema = require(curItem.file).createTempSchema(mongoose); 
        console.log('%s 모듈을 물러온 후 스키마 정의함 ', curItem.file);
        
     
        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위한 모델 정의함 ', curItem.collection);
        
       
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('스키마이름 : %s, 모델이름 : %s이 database 객체의 속성으로 추가됨', curItem.schemaName, curItem.modelName);
        break;
        }
        var curSchema = require(curItem.file).createSchema(mongoose); 
        console.log('%s 모듈을 물러온 후 스키마 정의함 ', curItem.file);
        
     
        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위한 모델 정의함 ', curItem.collection);
        
       
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('스키마이름 : %s, 모델이름 : %s이 database 객체의 속성으로 추가됨', curItem.schemaName, curItem.modelName); 
    }
    
    app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨')
    
}


module.exports = database;