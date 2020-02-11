const express = require('express');
const db = require('../data/db.js');
const router = express.Router();

// GET request to /api/posts
router.get('/', (req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({ errorMessage: 'The posts information could not be retrieved' });
        });
});

// POST request to /api/posts
router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
    }
    db.insert({ title, contents })
        .then(({ id }) => {
            db.findById(id)
                .then(([post]) => {
                    res.status(201).json(post);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ errorMessage: 'Error getting post' });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error inserting post' });
        });
});

// GET request to /api/posts/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(post => {
        console.log(post);
        if (post.length) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
        }
    });
});

// PUT request to /api/posts/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const contents = req.body.contents;
    const title = req.body.title;

    if (!title && !contents) {
        return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
    }

    db.update(id, { title, contents })
        .then(updated => {
            console.log(updated);
            if (updated) {
                db.findById(id)
                .then(([post]) => {
                    res.status(200).json(post);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ errorMessage: 'Error getting post' });
                });
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
            }
            })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({ errorMessage: 'The post information could not be modified.' });
        });
});

// DELETE request to /api/posts/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then(removed => {
            if (removed) {
                res.status(204).end();
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The post could not be removed' });
        });
});

// GET request to /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            if (comments.length) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The comments information could not be retrieved.' });
        });
});

// POST request to /api/posts/:id/comments
router.post('/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const { text } = req.body;

    if (text === '' || typeof text !== 'string') {
        return res
            .status(400)
            .json({ errorMessage: 'Please provide text for the comment.' });
    }

    db.insertComment({ text, post_id })
        .then(comment_id => {
            res.status(200).json(comment_id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'There was an error while saving the comment to the database' });
        });
});

module.exports = router;