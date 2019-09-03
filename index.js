const express = require('express')
const db = require('./data/db')

const server = express()
server.use(express.json())

server.get('/api/users', (req, res) =>
{
    db.find()
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(error =>
            {
                res.status(500).json({ error: "The users information could not be retrieved." })
            })
})

server.get('/api/users/:id', (req, res) =>
{
    const id = req.params.id
    db.findById(id)
        .then(response =>
            {
                if(response)
                {
                    res.status(200).json(response)
                }
                else
                {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ error: "The user information could not be retreived" })
            })
})

server.post('/api/users', (req, res) =>
{
    if(!req.body.name || !req.body.bio)
    {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user" })
    }
    else
    {
        db.insert(req.body)
            .then(response =>
                {
                    db.findById(response.id)
                    .then(response =>
                        {
                            res.status(201).json(response)
                        })
                })
            .catch(error =>
                {
                    res.status(500).json({ error: "There was an error while saving the user to the database" })
                })
    }
})

server.delete('/api/users/:id', (req, res) =>
{
    const id = req.params.id
    db.remove(id)
        .then(response =>
            {
                if(response)
                {
                    res.sendStatus(200)
                }
                else
                {
                    res.status(404).json({ message: "The user with the specified ID does not exist" })
                }
            })
        .catch(err =>
            {
                res.status(500).json({ error: "The user could not be removed" })
            })
})

server.put('/api/users/:id', (req, res) =>
{
    const id = req.params.id
    if(!req.body.name || !req.body.bio)
    {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user" })
    }
    else
    {
        db.update(id, req.body)
            .then(response =>
                {
                    if(response)
                    {
                        db.findById(id)
                            .then(response =>
                                {
                                    res.status(200).json(response)
                                })
                    }
                    else
                    {
                        res.status(404).json({ message: "The user with the specified ID does not exist." })
                    }
                })
            .catch(err =>
                {
                    res.status(500).json({ error: "The user information could not be modified." })
                })
    }
})

server.listen(5000, _ =>
{
    console.log("Server listening on port 5000")
})