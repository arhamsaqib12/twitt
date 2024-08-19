const { Users } = require('./auth/usermodal');
const { Twitter } = require('./modal');
const { Like } = require('./appriciate/appriciate');

// Define associations
Users.hasMany(Twitter, { foreignKey: 'userId' });
Twitter.belongsTo(Users, { foreignKey: 'userId' });

// Many-to-Many relationship for Likes
Users.belongsToMany(Twitter, { through: Like, foreignKey: 'userId', as: 'likedTweets' });
Twitter.belongsToMany(Users, { through: Like, foreignKey: 'postId', as: 'likingUsers' });

// One-to-Many relationship for Likes
Twitter.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Twitter, { foreignKey: 'postId', as: 'tweet' });

module.exports = { Users, Twitter, Like };
