const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();



 router.post('/register', authController.register);
router.post('/login', authController.login); 
router.delete('/logout', authController.logout); 

// router.delete('/logout', (req, res) => {
//     if (req.session) {
//       req.session.destroy(err => {
//         if (err) {
//           res.status(400).send('Unable to log out')
//         } else {
//           res.send('Logout successful')
//         }
//       });
//     } else {
//       res.end()
//     }
//   })


module.exports = router