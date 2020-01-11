const express = require('express');
const router = express.Router();



const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'}
];


router.get('/', (req,res)=>{
    res.send(courses);
});
// /api/courses/1

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);// result.error, this is called object desctructuring
    //400 Bad Request
    if (error)return res.status(400).send(error.details[0].message);
    const course = {
       id: courses.length + 1,
       name: req.body.name     
    };
    courses.push(course);
    res.send(course);
});

router.put('/:id', (req,res) => {
    // look up the course
    //if nto existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    //Validate
    //If invalid return 400 - Bad request
    const { error } = validateCourse(req.body);// result.error, this is called object desctructuring
    //400 Bad Request
    if (error)return res.status(400).send(error.details[0].message);
    // Update coruse
    course.name = req.body.name;
    //Return the updated course 
    res.send(course);
});


router.delete('/:id', (req,res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    //Return the same course
    res.send(course);
});

function validateCourse(course){
    const schema  = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

router.get('/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});


module.exports = router;