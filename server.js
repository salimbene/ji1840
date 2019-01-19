require('dotenv').config();
const helmet = require('helmet'); //Secure HTTP headers
const morgan = require('morgan'); //Logging HTTP requests
const config = require('config'); //Handle config settings
const debug = require('debug')('app:server'); //Formated & Located debugging
const debugM = require('debug')('app:mongo');

const expenses = require('./routes/expenses');
const consortia = require('./routes/consortia');
const users = require('./routes/users');
const home = require('./routes/home');
const auth = require('./routes/auth');

const express = require('express');
const app = express();

const mongoose = require('mongoose');
// const Consortium = require('./models/consortium');

// const { User } = require('./models/user');
// const { FUnit } = require('./models/funit');

const TEST_DB = 'jitests';

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect(
    `mongodb://localhost/${TEST_DB}`,
    { useNewUrlParser: true }
  )
  .then(() => debugM('Connected to MongoDB...'))
  .catch(err => debugM('Could not connect', err));

//Logging only on development environment
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

// debug('name', config.get('name'));
// debug('mail.host', config.get('mail.host'));
// debug('mail.password', config.get('mail.password'));

app.use(express.json());
app.use(helmet());

//Routes
app.use('/api/expenses', expenses);
app.use('/api/consortia', consortia);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));

// async function createUser(
//   lastname,
//   firstname,
//   mail,
//   phone,
//   propietaryType,
//   role
// ) {
//   const user = new User({
//     lastname,
//     firstname,
//     mail,
//     phone,
//     propietaryType,
//     role
//   });

//   const result = await user.save();
//   debugM(result);
// }

// async function createFUnit(fUnit, floor, flat, share, landlord, debts) {
//   const funit = new FUnit({
//     fUnit,
//     floor,
//     flat,
//     share,
//     landlord,
//     debts
//   });

//   const result = await funit.save();
//   debugM(result);
// }

// async function listFUnits() {
//   const fUnits = await FUnit.find()
//     .populate()
//     .select();
//   debugM(fUnits);
// }

// createUser(
//   'VAZQUES',
//   'lala',
//   'lala@mail',
//   1289896767,
//   'Propietario',
//   'Usuario'
// );

// async function addDebt(fUnitId, debt) {
//   const fUnit = await FUnit.findById(fUnitId);
//   fUnit.debts.push(debt);
//   fUnit.save();
// }

// async function removeDebt(fUnitId, debtId) {
//   const fUnit = await FUnit.findById(fUnitId);
//   const debt = fUnit.debts.id(debtId);
//   debt.remove();
//   fUnit.save();
// }

// createFUnit(21, 1, 'A', 5.75, '5c3bc54fae1805110d3c85bc', [
//   new Debt({ ammount: 1000 }),
//   new Debt({ ammount: 1500 })
// ]);

// addDebt('5c3bc7de5a4f3d11f1923536', new Debt({ ammount: 7500 }));
// removeDebt('5c3bc7de5a4f3d11f1923536', '5c3bc8c1ee457e1210f1775e');

// listFUnits();
