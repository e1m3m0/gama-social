const { Thought, User } = require("../models");

const thoughtController = {
  getAllThought(req, res) {
    Thought.find({})
      .then((dbThought) => res.json(dbThought))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getOneThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No Thought found with this id!" });
          return;
        }
        res.json(dbThought);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createThought({ body }, res) {
    Thought.create({ thoughtText: body.thoughtText, username: body.username })
      .then((response) =>
        User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: response._id } },
          { new: true }
        )
      )
      .then((dbThought) => res.json(dbThought))
      .catch((err) => res.status(400).json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
    .then((dbThought) => {
      if (!dbThought) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThought);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then((dbThought) => {
      if (!dbThought) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThought);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $push: {reactions: body }},
      { new: true, runValidators: true }
    )
    .then((dbThought) => {
      if (!dbThought) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThought);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  },
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    )
    .then((dbThought) => {
      if (!dbThought) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThought);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  },
};

module.exports = thoughtController;
