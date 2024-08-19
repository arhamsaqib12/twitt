const { Users } = require('./auth/usermodal');
const { Twitter } = require('../modal');
const { Hashtag } = require('./hashtagmodel');

// Define many-to-many relationships
Twitter.belongsToMany(Hashtag, { through: 'PostHashtags' });
Hashtag.belongsToMany(Twitter, { through: 'PostHashtags' });

// Define one-to-many relationships
Users.hasMany(Twitter, { foreignKey: 'userId' });
Twitter.belongsTo(Users, { foreignKey: 'userId' });

// Synchronize models with the database
db.sync();
