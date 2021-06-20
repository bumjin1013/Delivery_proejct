var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
   
   var UserSchema = mongoose.Schema({
       id: {type: String, required: true, unique: true, 'default':''},
       hashed_password: {type: String, required: true, 'default':''},
       salt: {type:String, required:true},
       name: {type: String, index: 'hashed', 'default':''},
       age: {type: Number, 'default': -1},
       card_num: {type: Number, required: true, unique: true, 'default':''},
       cvc: {type: Number, required: true, 'default':''},
       exp_m: {type: String, required: true, 'default':''},
       exp_y: {type: String, required: true, 'default':''},
       created_at: {type: Date, index: {unique: false}, 'default': Date.now},
       updated_at: {type: Date, index: {unique: false}, 'default': Date.now},
       cart : [{
           store_name : {type :String, 'default' : ''},
           menu_name : {type : String, trim : true, 'default' : ''},
           price : {type : Number, required: true, 'default' : ''},
           num : {type : Number, 'default' :''},
        }],
       order:[{
           store_name : {type :String, 'default' : ''},
           menu_list: {type:String, 'default':''},
           address :{type: String, 'default': ''},
           phonenum:{type: Number, 'default':''},
           forOwner:{type: String, 'default':''},
           forRider:{type: String, 'default':''},
           final_price:{type: Number, 'default':''},
           timestamp: {type: String, 'default': Date().toString("yyyy-MM-dd-HH-mm")}
       }],
   });
   
   UserSchema
     .virtual('password')
     .set(function(password) {
       this._password = password;
       this.salt = this.makeSalt();
       this.hashed_password = this.encryptPassword(password);
       console.log('virtual password 호출됨 : ' + this.hashed_password);
     })
     .get(function() { return this._password });
   

   UserSchema.method('encryptPassword', function(plainText, inSalt) {
      if (inSalt) {
         return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
      } else {
         return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
      }
   });
   

   UserSchema.method('makeSalt', function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
   });
   

   UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
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
      

   UserSchema.pre('save', function(next) {
      if (!this.isNew) return next();
   
      if (!validatePresenceOf(this.password)) {
         next(new Error('유효하지 않은 password 필드입니다.'));
      } else {
         next();
      }
   })
   

   UserSchema.path('id').validate(function (id) {
      return id.length;
   }, 'id 칼럼의 값이 없습니다.');
   
   UserSchema.path('name').validate(function (name) {
      return name.length;
   }, 'name 칼럼의 값이 없습니다.');
   
   UserSchema.path('hashed_password').validate(function (hashed_password) {
      return hashed_password.length;
   }, 'hashed_password 칼럼의 값이 없습니다.');
   
      
   UserSchema.static('findById', function(id, callback) {
      return this.find({id:id}, callback);
   });
   
   UserSchema.static('findAll', function(callback) {
      return this.find({}, callback);
   });
   
   console.log('UserSchema 정의함.');

   return UserSchema;
};


module.exports = Schema;
