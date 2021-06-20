var crypto = require('crypto');

var owner_Schema = {};

owner_Schema.createSchema = function(mongoose) {
   
   var OwnerSchema = mongoose.Schema({
       id: {type: String, required: true, unique: true, 'default':''},
       hashed_password: {type: String, required: true, 'default':''},
       salt: {type:String, required:true},
       name: {type: String, index: 'hashed', 'default':''},
       age: {type: Number, 'default': -1},
       store_name: {type:String, required:true, unique: true, 'default' : ''},
       store_img : {type:String, required:true, unique: true, 'default' : ''},
       info : {type:String, required:true, 'default' :''},
       latitude : {type:String, default:''},
       hardness : {type:String, default:''},
       created_at: {type: Date, index: {unique: false}, 'default': Date.now},
       updated_at: {type: Date, index: {unique: false}, 'default': Date.now},
       menu : [{
           menu_name : {type : String, trim : true, 'default' : ''},
           price : {type : Number, required: true, 'default' : ''},
           menu_img : {type : String, unique: false, 'default' :''},
        }],
       order:[{
           orderID : {type :String, 'default' : ''},
           menu_list: {type:String, 'default':''},
           address :{type: String, 'default': ''},
           phonenum:{type: Number, 'default':''},
           forOwner:{type: String, 'default':''},
           forRider:{type: String, 'default':''},
           final_price:{type: Number, 'default':''},
           timestamp: {type: String, 'default': Date().toString()}
       }],
       review:[{
           writer:{type: String, 'default' :''},
           contents:{type: String, 'default' :''},
           comment:{type:String, 'default' :''},
           timestamp: {type: String, 'default': Date().toString()},
           star:{type: Number, 'default':''}
       }]
   });
   
   OwnerSchema
     .virtual('password')
     .set(function(password) {
       this._password = password;
       this.salt = this.makeSalt();
       this.hashed_password = this.encryptPassword(password);
       console.log('virtual password 호출됨 : ' + this.hashed_password);
     })
     .get(function() { return this._password });
   

   OwnerSchema.method('encryptPassword', function(plainText, inSalt) {
      if (inSalt) {
         return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
      } else {
         return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
      }
   });
   

   OwnerSchema.method('makeSalt', function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
   });
   

   OwnerSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
      if (inSalt) {
         console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
         return this.encryptPassword(plainText, inSalt) === hashed_password;
      } else {
         console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
         return this.encryptPassword(plainText) === this.hashed_password;
      }
   });
   

   var validatePresenceOf = function(value) {
      return value && value.length;
   };
      

   OwnerSchema.pre('save', function(next) {
      if (!this.isNew) return next();
   
      if (!validatePresenceOf(this.password)) {
         next(new Error('유효하지 않은 password 필드입니다.'));
      } else {
         next();
      }
   })
   

   OwnerSchema.path('id').validate(function (id) {
      return id.length;
   }, 'id 칼럼의 값이 없습니다.');
   
   OwnerSchema.path('name').validate(function (name) {
      return name.length;
   }, 'name 칼럼의 값이 없습니다.');
   
   OwnerSchema.path('hashed_password').validate(function (hashed_password) {
      return hashed_password.length;
   }, 'hashed_password 칼럼의 값이 없습니다.');
   
      
   OwnerSchema.static('findById', function(id, callback) {
      return this.find({id:id}, callback);
   });
   
   OwnerSchema.static('findAll', function(callback) {
      return this.find({}, callback);
   });
   
   console.log('UserSchema 정의함.');

   return OwnerSchema;
};


module.exports = owner_Schema;