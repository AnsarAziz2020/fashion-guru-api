const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const global = require('../global')
const User = require('../models/user');
const fetchUser = require('../middleware/fetchUser');
const VerifyUser = require('../middleware/verifyUser');
const db_functions = require('../controllers/db_functions');
const multer = require('multer');
const path = require('path');
const { response } = require('../app');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        // Use the original file name with a timestamp to avoid overwriting
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });


router.post('/createuser', async (req, res) => {
    try {
        console.log(req.body)
        let { name, email, phone_no, address, type, shop_name, password, profile_pic } = req.body;
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt)
        const id = global.generateRandomString(12)
        profile_pic = 'profile_pic.png';
        const newUser = new User({ id, name, email, phone_no, password: securePass, address, type, shop_name, profile_pic })

        newUser.insertUser().then((result) => {
            res.json({ "authToken": newUser.generateNewToken() })
        })
            .catch((err) => {
                res.send(err)
            })

    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

router.post('/login', (req, res) => {
    const { email, password, fcm_token } = req.body;
    const loginUser = new User({
        email,
        password,
        fcm_token
    })
    // console.log(fcm_token)
    loginUser.findUser().then((value) => {
        res.json(value)
    })
        .catch((err) => {
            res.status(401).json(err)
        })
})

router.post('/getuser', fetchUser, async (req, res) => {
    const newUser = req.user;
    console.log(newUser);
    let user = new User(newUser)
    user.getCurrentUser().then((response) => {

        res.status(200).json(response);
    }).catch((e) => {
        res.status(400).json(e);
    })

})

router.post('/getalluser', async (req, res) => {
    let user = new User()
    user.getAllUser().then((response) => {
        res.status(200).json(response);
    }).catch((e) => {
        res.status(400).json(e);
    })

})

router.post('/getuserbytype', async (req, res) => {
    let { type } = req.body
    let user = new User()
    user.getUsersByType(type).then((response) => {
        res.status(200).json(response);
    }).catch((e) => {
        res.status(400).json(e);
    })

})

router.post('/uploadprofilepic', upload.single('file'), async (req, res) => {
    const { id } = req.body;
    const file = req.file
    console.log(file)
    console.log(id)
    let user = new User({ id, profile_pic: file.filename });
    user.UpdateProfilePic().then((response) => {
        console.log(response)
        res.status(200).json(response)
    }).catch((e) => {
        res.status(400).json(e)
    })
})

router.post('/forgetpassword', async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(password, salt)
    const newUser = new User({ email, password: securePass });
    newUser.UpdatePassword().then((result) => {
        res.json({ "code": "User Updated" })
    })
        .catch((e) => {
            res.json({ "e": "try again" })
        })
})

router.post('/change/profile', VerifyUser, async (req, res) => {
    const { type, value } = req.body
    let uniqueCheck;
    if (type == "email" || type == "phone_no") {
        uniqueCheck = await db_functions.request(`select * from users where ${type} = '${value}'`)
    }
    if (!uniqueCheck) {
        db_functions.request(`update users set ${type} = '${value}' where id = '${req.user['id']}'`).then((value) => {
            res.status(200).json({ "message": `Profile Updated` })
        })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ error, "message": "Server Not Responding" })
            })
    } else {
        res.status(404).json({ "message": `${(type.charAt(0).toUpperCase() + type.slice(1)).replace("_", " ")} already exist` })
    }
})
router.post('/duplicatecheck', async (req, res) => {

    try {
        const { email, contact_no } = req.body
    let uniqueEmail, uniqueContactNo;
    let response = {}
    uniqueEmail = await db_functions.request(`select * from users where email = '${email}'`)
    uniqueContactNo = await db_functions.request(`select * from users where phone_no = '${contact_no}'`)
    console.log(uniqueEmail)
    console.log(uniqueContactNo)
    if (uniqueEmail.length==0 && uniqueContactNo.length==0) {
        response['message'] = 'Account Created'
        res.status(200).json(response)
    } else {
        if (uniqueEmail.length>0) {
            response['message'] = "Email Already Exist"
            res.status(404).json(response)
        } else {
            response['message'] = "Contact No Already Exist"
            res.status(404).json(response)
        }
    }
    } catch (error) {
        res.status(500).json({'message':"Server Issue"})
    }



})

module.exports = router