const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.post('/createcategory', async (req, res) => {
    try {
        const { category_name, category_description } = req.body;
        const newCategory = new Category({ category_name, category_description });
        
        newCategory.insertCategory().then((result) => {
            res.json({ "message": "Category created successfully" });
        })
        .catch((err) => {
            res.status(500).json({ "error": "Failed to create category", "details": err });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

router.get('/getcategories', async (req, res) => {
    try {
        const allCategories = new Category({});
        
        allCategories.getAllCategories().then((categories) => {
            res.json({ "categories": categories });
        })
        .catch((err) => {
            res.status(500).json({ "error": "Failed to fetch categories", "details": err });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

// Add more routes for category-related operations

module.exports = router;
