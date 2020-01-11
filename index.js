const debug = require('debug')('app:startup');
const dbDebugger = require ('debug')('app:db');
const mongoose =  require('mongoose')
const config = require('config');
const morgan = require('morgan');
const helmet = require ('helmet');
const Joi = require('@hapi/joi');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.json());
app.use(express.urlencoded({extended: true}));//parses incoming requests with urlencoded payloads
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses',courses);
app.use('/',home);

//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

mongoose.connect(config.get('db'), {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> dbDebugger('connected to MongoDB'))
.catch(err => dbDebugger(`Could not connect to MongoDB...${err}`));

const medicalInstitutionSchema = new mongoose.Schema({
    Title: String,
    PhotoUrl: String,
    Description: String,
    Deleted: {type: Boolean, default: false},
    LastUpdated: Date,
    DateCreated: Date
});

const MedicalInstitution = mongoose.model('MedicalInstitution', medicalInstitutionSchema);

async function createMedicalInstitution(){
    const medicalInstitution = new MedicalInstitution({
        Title: 'Darnell Medical Services',
        PhotoUrl: null,
        Description: 'Test Description darnell',
        LastUpdated: Date.now(),
        DateCreated: Date.now()
    });
    const result = await medicalInstitution.save();
    dbDebugger(result);
}

async function getMedicalInstitutions(){
    //eq (equal)
    //ne (not equal)
    //gt (greater than)
    //gte (greater than or equal to)
    //lt (less than or equal to)
    //in
    //nin (not in)

    // or
    // and

    //filtering strings
    //regex /pattern/
    //^String starts with
    //$ End
    //Starts with Medical

    const medicalInstitutions = await MedicalInstitution
        //starts with
        //.find({Title: /^Darnell/})
        //ends with. i makes it case sensitive
        //.find({Description: /Darnell$/i})

        //contains 'medical
        .find({Title: /.*Medical.*/})

        //.or([{Title: 'Yuri Medical Services'}, {Description: 'Test Description darnell'}])
        .limit(2)
        .sort({Title: -1})
        //.select({Title: 1, Description:1})
        .count()
        ;
    dbDebugger(medicalInstitutions);
}

getMedicalInstitutions();


if (app.get('env') === 'development'){
    app.use(morgan('tiny'));//logs all requests to console
    debug('Morgan enabled');

}

//dbDebugger('Connected to the Database');


app.use(logger);
app.use(authenticator);


// PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));



