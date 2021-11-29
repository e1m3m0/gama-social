const { User } = require('../models')

const userController = {

  getAllUser(req, res) {
    User.find({})
    .populate({ path: 'thoughts', select: '-__v'})
    .populate({ path: 'friends', select: '-__v'})
    .select('-__v')
    .then((dbUser) => res.json(dbUser))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)
    })
  },

  getOneUser({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({ path: 'friends', select: '-__v' })
    .populate({ path: 'thoughts', select: '-__v', populate: { path: 'reactions'}})
    .select('-__v')
    .then((dbUser) => {
      if (!dbUser) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)
    })
  },

  createUser({ body }, res ) {
    User.create(body)
    .then((dbUser) => res.json(dbUser))
    .catch((err) => res.status(400).json(err))
  },

  updateUser({ params, body}, res) {
    User.findOneAndUpdate({ _id: params.id}, body, {new: true, runValidators: true})
    .then((dbUser) => {
      if (!dbUser) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)
    })
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then((dbUser) => {
      if (!dbUser) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser);
      User.find(
        {$pull: { friends: params.id }}
      )
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)
    })
  },

  addFriend({ params }, res ) {
    User.findByIdAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .then((dbUser) => {
      if (!dbUser) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)
    })
  },

  removeFriend({ params }, res ) {
    User.findByIdAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
    .then((dbUser) => {
      if (!dbUser) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUser)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err)
    })
  },
}

module.exports = userController;