'use strict';

const bcrypt = require('bcrypt-nodejs')

module.exports.hashpwd = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};

module.exports.comparepwd = function(password, dbpwd){
    return bcrypt.compareSync(password, dbpwd);
};