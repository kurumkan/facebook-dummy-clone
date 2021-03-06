const mongoose = require('mongoose');
const bcrypt=require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique:true, lowercase: true, trim: true, sparse: true },
  email: { type: String, unique:true, lowercase: true, trim: true, sparse: true },
  password: { type: String, trim: true },
  firstName: { type: String, unique:false, trim: true, sparse: true },
  lastName: { type: String, unique:false, trim: true, sparse: true },
  imageUrl: { type: String, unique:false, trim: true, sparse: true },
  last_seen_at: { type: Date },
});


userSchema.pre('save', function(next){
  const user = this;

  //generate salt
  bcrypt.genSalt(10, function(error, salt){
    if(error) {
      return next(error);
    }
    //hash the password via bcrypt
    bcrypt.hash(user.password, salt, null, function(error, hash){
      if(error) {
        return next(error);
      }
      user.password=hash;
      next();
    })
  })
});

//define a new function on userSchema
userSchema.methods.comparePassword = function(submittedPassword, callback){
  bcrypt.compare(submittedPassword, this.password, function(error, isMatch){
    if(error){
      return callback(error)
    };

    callback(null, isMatch);
  })
}


module.exports = mongoose.model('user', userSchema);