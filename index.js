const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


//CONNECT TO MONGODB DATABASE
mongoose.connect('mongodb://localhost/todos', {useNewUrlParser: true})
mongoose.set('strictQuery', true);

const Schema = mongoose.Schema;
const TodoSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

const Todo = mongoose.model('Todo', TodoSchema);


const app = express()
const PORT = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// ROUTES
//ALL TODOS
app.get('/todos', (request, response) => {
    //find all todos in the database

    Todo.find({}, (error, todos) => {
        if (error) {
            response.status(500).send(error)
        } else {
            response.send(todos)
        }
    })
    
});

// CREATE TODOS

app.post('/todos', (request, response) => {
    //create todo

    const todo = new Todo({text: request.body.text});

    //save the created todo to the DB
    todo.save((error, todo)=> {
        if (error) {
            response.status(500).send(error);
        } else {
            response.send(todo);
        }
    });
});


//EDIT TODOS

app.put('/todos/:id', (request, response)=> {
    Todo.findById(request.params.id, (error, todo) => {
        if (error) {
            response.status(500).send(error);
        } else {
            todo.text = request.body.text;
            todo.save((error, todo) => {
                if (error) {
                    response.status(500).send(error);
                } else {
                    response.send(todo)
                }
            })
        }
    })
});



// REMOVE TODOS

app.delete('/todos/:id', (request, response) => {
    Todo.findByIdAndRemove(request.params.id, (error, todo)=> {
        if(error) {
            response.status(500).send(error);
        } else {
            response.send(todo)
        }
    })

})





// LISTENING FUNCTION

app.listen(PORT, ()=> {
    console.log(`Listening to Secure PORT ${PORT}`)
})