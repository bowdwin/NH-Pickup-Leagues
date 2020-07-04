/* eslint-disable linebreak-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
// Creating our User model
module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-var
  const User = sequelize.define('User', {
    userId: {
      id: uuid(),
    },
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  // Creating a custom method for our User model. This will check if an
  // unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = (password) =>
    bcrypt.compareSync(password, this.password);
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook('beforeCreate', (user) => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return User;
};