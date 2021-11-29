const router = require('express').Router();

const { getAllThought, getOneThought, createThought, updateThought, deleteThought, addReaction, deleteReaction } = require('../../controllers/thought-controller');

router.route('/').get(getAllThought).post(createThought);

router.route('/:id').get(getOneThought).put(updateThought).delete(deleteThought);

router.route('/:id/reactions').post(addReaction);

router.route('/:id/reactions/:reactionId').delete(deleteReaction);

module.exports = router;