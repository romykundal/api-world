/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var promisify = require('bluebird').promisify;
var bcrypt    = require('bcrypt-nodejs');

module.exports = {
    autoCreatedAt: true,
    autoUpdatedAt: true,

    attributes: {

        firstName: {
            type: 'string',
            required: true
        },
        
        lastName: {
            type: 'string',
            required: true
        },

        fullName: {
            type: 'string',
            required: true
        },     

        username: {
            type: 'email',
            unique: true,
            required: 'Please enter valid email id.'
        },

        mobile: {
            type: 'integer',
            maxLength: 10,
            required: true
        },

        password: {
            type: 'string',
            required: true,
            columnName: 'encryptedPassword',
            minLength: 8
        },

        isDeleted : {
            type: 'Boolean',
            defaultsTo: false
        },

        comparePassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },

        toJSON: function() {

            var obj = this.toObject();
            delete obj.password;

            return obj;
        }

    },

    beforeCreate: function(user, next) {
        if(user.firstName && user.lastName) {
            user.fullName = user.firstName + ' ' + user.lastName;
        }

        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);

        } else {
            next(null, user);
        }
    },


    beforeUpdate: function(user, next) {
        if(user.firstName && user.lastName) {
            user.fullName = user.firstName + ' ' + user.lastName;
        }

        if (user.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            next(false, user);
        } else {
            next(null, user);
        }
    },

  /*  authenticate: function (username, password) {
        var query = {};
        query.username = username;
        query.$or = [{roles:["SA","A"]}];

        return Users.findOne(query).populate('roleId').then(function(user){ 
        //return API.Model(Users).findOne(query).then(function(user){
            return (user && user.date_verified && user.comparePassword(password))? user : null;
        });
    },*/

};