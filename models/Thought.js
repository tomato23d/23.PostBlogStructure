
const {Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema({
  thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
  username: { type: String, required: true },
  userId: { type: String, required: true},
  reactions: [reactionSchema],
  createdAt:{ type: Date, default: Date.now },

  //// add getter to format the timestamp

},
{
  toJSON: {
    virtuals: true,
  },
  id: false,
});
 
//reactions count per thought
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});


const Blog = model('Blog', thoughtSchema);



module.exports = Blog;
