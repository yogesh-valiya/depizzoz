const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

const init = passport => {
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (username, password, done) => {
        console.log("Email: "  + username);
        console.log("Password: "  + password);
        const user = await User.findOne({email: username})
        if(!user){
            return done(null, false, {message: "Invalid password or username."})
        }
        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {message: "Logged in successfully."})
            }else{
                return done(null, false, {message: "Invalid password or username."})
            }
        }).catch(err => {
            return done(null, false, {message: "Something went wrong."})
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = init