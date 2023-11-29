import mysql from 'mysql2';
import express  from 'express';
import cors from 'cors'
import multer from 'multer';

const PORT = 8800
const app = express()
app.listen(PORT, () => {
    console.log("Connected!")
})
const db = mysql.createConnection( {
    host: "localhost",
    user: "root",
    database: "test",
    password: "server1234"
})
app.use(cors())
app.use(express.static('Images'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, "Images/")
    },
    filename: (req, file, cb) =>{
        
        return cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

app.post('/upload', upload.single('image'), (req,res) => {
    console.log(req.file)
    const imagePath = req.file.path
    res.json({imagePath: imagePath})
})

// app.get('/images/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const imagePath = path.join(__dirname, 'Images', filename);

//     // Отправляем файл в ответ
//     res.sendFile(imagePath);
// });

app.use(express.json())

app.get("/img/:recipeId", (req, res) => {
    const recipeId = req.params.recipeId;
    const q = `
        select image_path from recipes where id = ? 
    `
    db.query(q,[recipeId],(err,data)=> {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/recipe", (req,res) =>{
    const q = "SELECT * FROM recipes"
    db.query(q, (err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/recipe/:recipeId/ingredients", (req,res) => {
    const recipeId = req.params.recipeId;
    
    const q = `
        SELECT ingredients.name, recipe_ingredients.quantity
        FROM ingredients
        JOIN recipe_ingredients ON ingredients.id = recipe_ingredients.ingredient_id
        WHERE recipe_ingredients.recipe_id = ?;
    `
    db.query(q,[recipeId],(err,data)=> {
        if(err) return res.json(err)
        return res.json(data)
    })
})
app.get("/recipe/:recipeId/steps", (req, res) => {
    const recipeId = req.params.recipeId;
    const q = `
        SELECT 
            step_number,
            description as step_description
        FROM recipe_steps
        WHERE recipe_id = ?;
    `
    db.query(q, [recipeId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    });
});


// app.post("/recipe", (req,res) => {
//     const q = "INSERT INTO recipes (`title`, `description`) VALUES (?)"
//     const values = [
//         req.body.title,
//         req.body.description
//     ]
//     db.query(q,[values],(err,data) => {
//         if(err) return res.json(err)
//         return res.json("Recipe created successful")
//     })
// })



// db.end(err => {
//     if (err) {
//         console.log(err);
//         return err
//     }
//     else{
//         console.log("database closed")
//     }
// })

// conn.connect(err => {
//     if(err){
//         return err;
//     }
//     else{
//         console.log("database ok")
//     }
// })
// let query = "SELECT * FROM user"
// conn.query(query,(err, result, field) => {
//     console.log(err)
//     console.log(result)
//     console.log(field)
// })
// conn.end(err => {
//     if (err) {
//         console.log(err);
//         return err
//     }
//     else{
//         console.log("database closed")
//     }
// })