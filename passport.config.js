const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initilize(passport, GetUserByEmail, GetUserById) {

	const AuthenticateUser = async (email, password, done) => {
		
		const user = GetUserByEmail(email);

		if(user==null) {
			return done(null, false, {message: "No user with that email"});
		}

		try {
			if(await bcrypt.compare(password, user.password)) {
				return done(null, user);

			} else {
				return done(null, false, {message: "Password incorrect"});
			}

		} catch(e) {

		}
	}

	passport.use(
		new LocalStrategy({ usernameField: "email"}, AuthenticateUser));
	passport.serializeUser((user, done) => done(null, user.id) );
	passport.deserializeUser((id, done) => { 
		done(null, GetUserById(id))
	} );
}

module.exports = initilize;