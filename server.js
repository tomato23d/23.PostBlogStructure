const express = require('express');
const db = require('./config/connection');

const { Thought, User } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.post('/user', async(req, res) => {
  try{
    const result = await User.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }});
  

  
  app.put('/user/:userId', async(req, res) => {
    try{
      const result = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$set: req.body},
        {runValidators: true, new: true }
        );
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'Internal Server Error' });
    }});


 
  app.delete('/user/:userId', async(req, res) => {
    try{
      const user = await User.findOneAndDelete(
        {_id: req.params.userId},
        {$pull: {thoughts: {userId: req.params.userId}}}
        );
     console.log(user);

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'Internal Server Error' });
    }});
    


app.get('/users', async(req, res) => {
  try{
    const result = await User.find();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }});
  



  app.post('/user/:userId/friend', async(req, res) => {
    try{
      console.log('userId');
      console.log( req.params.userId);
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$addToSet: { friends: req.body}},
        {runValidators: true, new: true }
      );
  
    if (!user) {
      return res.status(500).send({ message: 'No user with that ID' })
    }
  
    res.json({user});
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
  });

  
  app.delete('/user/:userId/friend/:friendId', async(req, res) => {
    try{
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$pull: { friends: req.params.friendId}},
        {new: true }
      );
      res.json({ message: 'Application successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }});


  app.post('/user/:userId/thought', async(req, res) => {
    try{
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$addToSet: { thoughts: req.body}},
        {runValidators: true, new: true }
      );
  
    if (!user) {
      return res.status(500).send({ message: 'No user with that ID' })
    }
  
    res.json({user});
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }});
  

  app.post('/user/:username/thought', async(req, res) => {
    try{
      const user = await User.findOneAndUpdate(
        {username: req.params.username},
        {$addToSet: { thoughts: req.body}},
        {runValidators: true, new: true }
      );
  
    if (!user) {
      return res.status(500).send({ message: 'No user with that ID' })
    }
  
    res.json({user});
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }});
  


  app.post('/thoughts', async(req, res) => {
    try{
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        {_id: req.body.userId},
        {$addToSet: {thoughts: thought._id}},
        {new: true }
      )
      console.log("user" + user);
      console.log("thought" + thought);

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'Internal Server Error' });
    }});
    

    app.get('/thoughts', async(req, res) => {
      try{
        const result = await Thought.find({});
        //console.log(result);
        res.status(200).json(result);
      } catch (err) {
        res.status(500).send({ message: 'Internal Server Error' });
       }});
      
    app.get('/thoughts/:thoughtId', async(req, res) => {
        try{
          const thought = await Thought.findOne(
            {_id: req.params.thoughtId});
            console.log(thought);
            res.status(200).json(thought);
          } catch (err) {
            console.log(err);
            return res.status(500).json(err);
            }});

    app.put('/thoughts/:thoughtId', async(req, res) => {
      try{
        const thought = await Thought.findOneAndUpdate(
          {_id: req.params.thoughtId},
          { $set: req.body },
          { runValidators: true, new: true}
          );
          console.log(thought);
          res.status(200).json(thought);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
          }});



    app.delete('/thoughts/:thoughtId', async(req, res) => {
      try{
        const thought = await Thought.findOneAndRemove(
          {_id: req.params.thoughtId});

        const user = await User.findByIdAndUpdate(
          { thoughts: req.params.thoughtId},
          { $pull: {thoughts: req.params.thoughtId}},
          { new: true}
          );
          res.json({ message: 'Application successfully deleted!' });
        } catch (err) {
          res.status(500).json(err);
        }});



app.get('/user/:userId', async(req, res) => {
  try{
   
  const user = await User.findOne(
      {_id: req.params.userId} )
   
    .select('-__v');
    if (!user) {
      return res.status(500).send({ message: 'No user with that ID' })
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


app.post('/thoughts/:thoughtId/reaction', async(req, res) => {
  try{
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body}},
      { runValidators: true, new: true }
      );
      res.json(thought);
    } catch (err){
      console.log(err);
      res.status(500).json(err);
    }});


app.delete('/thoughts/:thoughtId/reactions/:reactionId', async(req, res) => {
  try{
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId}}},
      { runValidators: true, new: true }
      );
      res.json(thought);
    } catch (err){
      res.status(500).json(err);
    }});



db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
