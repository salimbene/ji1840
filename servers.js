const helmet = require('helmet'); //Secure HTTP headers
const morgan = require('morgan'); //Logging HTTP requests
const config = require('config'); //Handle config settings
const debug = require('debug')('app:server'); //Formated & Located debugging
const debugM = require('debug')('app:mongo');
const funits = require('./routes/funits');
const home = require('./routes/home');

const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/ji1840')
  .then(() => debugM('Connected to MongoDB...'))
  .catch(err => debugM('Could not connect', err));

// async function createFu() {
//   const fUnit = new FUnit({
//     fUnit: 35,
//     floor: 2,
//     flat: 'd',
//     share: 4.6,
//     ownerLastname: 'Salimbene',
//     ownerFirstnames: 'Matias damian',
//     ownerMail: 'matias.salimbene@gmail.com',
//     ownerPhone: '1549288551',
//     isOccupied: true
//   });

//   try {
//     const result = await fUnit.save();
//     debugM(result);
//   } catch (ex) {
//     for (field in ex.errors) debugM('Exception:', ex.errors[field].message);
//   }
// }

// createFu();

debug('app', config.get('name'));
debug('mail', config.get('mail.host'));
debug('mail', config.get('mail.password'));

app.use(express.json());
app.use(helmet());

//Logging only on development environment
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

//Routes
app.use('/api/funits', funits);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`));
