const mongoose = require('mongoose');

// SCHEMAS

//subdocument schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ },
 // thoughts: [{type: Schema.Types.ObjectId, ref: 'Blog'}],
  //friends: [{type: Schema.Types.ObjectId, ref: 'User'}],

});

//the user friends count
userSchema.virtual('friendsCount').get(function () {
  return this.friends.length;
});

//subdocument schema
const reactionSchema = new mongoose.Schema({
  reactionId: mongoose.ObjectId,
  reactionBody: { type: String, required: true,  maxLength: 280 },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


//parent schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
 // username: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reactions: [reactionSchema],
  createdAt:{ type: Date, default: Date.now },

  //// add getter to format the timestamp
 
});

//reactions count per thought
thoughtSchema.virtual('reactionsCount').get(function () {
  return this.reactions.length;
});


const User = mongoose.model('User', userSchema);
const Reaction = mongoose.model('Reaction', reactionSchema);
const Blog = mongoose.model('Blog', thoughtSchema);

//one:
// { thoughtText: 'First Thought', username: "Dilys", reactions: reactionsData},
//const reactionsData =  [{reaction: "An Original", username: "Petra"}, {reaction: "Imagine That", username: "Brian"}, {reaction: "Liquid Thought", username: "Betsy"}];
//two:
//const reactionsData =  [{reaction: "The picture tells the story", username: "Denise"}, {reaction: "Perfect visual voice to tell each story", username: "Dilys"}, {reaction: "I really love their drawings most of all", username: "Petra"}];
//{ thoughtText: "The Fine Art of Children's Book Illustration", username: "Shannon", reactions: reactionsData},

const reactionsData =  [{reaction: "The mood of this picture has been quite established", username: "John"}];
 

Blog.create(
  { thoughtText: "The opportunity to do a children's books happened by acident", username: "Julia", reactions: reactionsData},
  (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log(data);
  }
);

User.create(
  {username: "Dilys", email: "dilys@mail.com"},
  (err) => (err ? handleError(err) : console.log('Created new document'))
  );

User.insertMany([
  {username: "Petra", email: "petra@mail.com"},
  {username: "Brian", email: "brians@mail.com"},
  {username: "Betsy", email: "betsy@mail.com"},
  {username: "Shannon", email: "shannon@mail.com"},
  {username: "Denise", email: "denise@mail.com"},
  {username: "Julia", email: "julia@mail.com"},
  {username: "John", email: "john@mail.com"},
])

module.exports = Blog;
