const express = require('express');
const Task = require('../models/Task')
const taskSchema = require('../validation/taskValidation');

const router = express.Router();

// Placeholder tasks
const tasks = [
    { id: 1, name: 'Buy groceries', completed: false },
    { id: 2, name: 'Clean the house', completed: true },
    { id: 3, name: 'Finish project', completed: false },
];

// Get all tasks
router.get('/', async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        next(err)
    }
});


// Get a single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});


// Create a task
router.post('/', async (req, res, next) => {
    const { error, value } = taskSchema.validate(req.body, { abortEarly: false });

    if (error) {
        res.status(400);
        return next(new Error(error.details.map((err) => err.message).join(', ')));
    }

    const { name, completed = false } = value;

    try {
        const newTask = new Task({ name, completed });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});



// Update a task
router.put('/:id', async (req, res) => {
    const { error, value } = taskSchema.validate(req.body, { abortEarly: false, allowUnknown: true });

    if (error) {
        return res.status(400).json({
            errors: error.details.map((err) => ({
                message: err.message,
                field: err.path.join('.'),
            })),
        });
    }

    const { id } = req.params;
    const { name, completed } = value;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (name) task.name = name;
        if (completed !== undefined) task.completed = completed;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});



// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});


module.exports = router;
