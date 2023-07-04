
const {Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema({
  thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
  username: { type: String, required: true },
  userId: { type: String, required: true},
  reactions: [reactionSchema],
  createdAt:{ type: Date, default: Date.now },

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


const Thought = model('Thought', thoughtSchema);



module.exports = Thought;
