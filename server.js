const express = require('express');
const db = require('./config/connection');

const { Thought, User } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/thoughts', async(req, res) => {
  try{
    const result = await Thought.create(req.body);
    res.status(200).json(result);
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
    }    
  });

app.get('/thoughts/:thoughtId', async(req, res) => {
try{
      const result = await Thought.findOne(
        {_id: req.params.thoughtId}
      );
      //console.log(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
        }    
      });

app.post('/user', async(req, res) => {
try{
  const result = await User.create(req.body);
  res.status(200).json(result);
} catch (err) {
  console.log(err);
  res.status(500).send({ message: 'Internal Server Error' });
}});

app.post('/user/:username/friend', async(req, res) => {
  try{
    const user = await User.findOneAndUpdate(
      {username: req.params.username},
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

//fails
app.post('/user/:userId/friend', async(req, res) => {
  try{
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


//fails
app.delete('/user/:username/friend/', async(req, res) => {
  try{
    const user = await User.findOneAndRemove(
      {username: req.params.username},
      {$pull: { friends: req.body}},
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



app.get('/users', async(req, res) => {
  try{
    const result = await User.find();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }});
  
 
    app.get('/user/:userId', async(req, res) => {
    try{
     
    const user = await User.findOne(
        {_id: req.params.userId} )
     
      .select('-__v');
      if (!user) {
        return res.status(500).send({ message: 'No user with that ID' })
      }

      res.json({user});
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });

//include thoughts
  app.get('/userthought/:userId', async(req, res) => {
    try{
     
    const user = await User.findOne(
        {_id: req.params.userId},
        { $pull: { thoughts: req.params.userId } },
        { new: true } )
     
      .select('-__v');
      if (!user) {
        return res.status(500).send({ message: 'No user with that ID' })
      }

      res.json({user});
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
