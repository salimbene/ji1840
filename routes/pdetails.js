const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { PDetails, validate } = require('../models/pdetails');
const { User } = require('../models/user');
const _ = require('lodash');
const debug = require('debug')('routes:pdetails');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const pdetails = await PDetails.find()
    .populate('userId', '-password -isAdmin', 'User')
    .populate('model', '', 'pmodel')
    .sort('period');

  debug(pdetails);
  res.send(pdetails);
});

router.get('/:id', async (req, res) => {
  try {
    const pdetails = await PDetails.find()
      .where('period')
      .equals(req.params.id)
      .populate('userId', '-password -isAdmin', 'User')
      .populate([
        {
          path: 'model',
          model: 'pmodel',
          populate: {
            path: 'userId',
            model: 'User',
            select: '-password -isAdmin'
          }
        }
      ])
      .select('-date -__v')
      .sort('isPayed');

    res.send(pdetails);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La liquidación con ID: ${req.params.id} no existe.`);
  }
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let pdetails = await PDetails.findOne({ period: req.body.period });
  if (pdetails) return res.status(400).send('El período ya fue registrado.');

  pdetails = new PDetails(
    _.pick(req.body, [
      'period',
      'model',
      'userId',
      'expenses',
      'extra',
      'debt',
      'int',
      'isPayed'
    ])
  );

  await pdetails.save();

  res.send(pdetails);
});

router.put('/:id', [auth, admin], async (req, res) => {
  //Validation
  const { error } = validate(req.body);

  // El problema es que model y userid es "populados", tendria que ver como traer los Ids....
  if (error) return res.status(400).send(error.details[0].message);

  debug(req.body);
  const { userId, expenses, extra, debt, int } = req.body;
  const payment = expenses + extra + debt + int;

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $inc: { balance: payment * -1 } },
    { new: true }
  );

  debug(user.lastname, 'Se debitó:', payment * -1);

  const { isPayed } = req.body;
  const pdetails = await PDetails.findOneAndUpdate(
    { _id: req.params.id },
    { isPayed },
    { new: true }
  );
  debug(pdetails);

  res.send(pdetails);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const pdetails = await PDetails.findByIdAndRemove(req.params.id);
    res.send(pdetails);
    debug(`${pdetails._id} DELETED ok!`);
  } catch (ex) {
    debug(ex.message);
    res.status(404).send(`La liquidación ID: ${req.params.id} no existe.`);
  }
});

module.exports = router;
