const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');
// Create our User Model
class User extends Model {}

// Define table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITIONS GO HERE

        // Define an id column
        id: {
            // Use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // This is the equivalent of SQL's 'NOT NULL option
            allowNull: false,
            // Instruct that this is the Primary Key
            primaryKey: true,
            // Turn on auto increment 
            autoIncrement: true
        },
        
        // Define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // Define an email option
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
              isEmail: true
            }
        },
        // Define a password column

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // This means that the password must be at least four characters long
                len: [4]
            }

        }
    },
    {
        // TABLE CONFIGURATION OPTION GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        hooks: {
            // Set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData
            },
            // Set up beforeUpdate lifecycle "hook" functionalty
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // Pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // Don't automatically create createdAt/UpdatedAt timestamp fields
        timestamps: false,
        // Don't pluralize name of database table
        freezeTableName: true,
        // Use underscores insted of camel-casing (i.e `comment_text` and not `commentText`)
        underscored: true,
        // Make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;