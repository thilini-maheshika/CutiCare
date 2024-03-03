const express = require('express');

const { login,
    getAll,
    changeUsername,
    meUpdateUser,
    changeEmail,
    findUser,
    changePassword,
    addUser,
} = require('../../mvc/user/UserController');
const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');
// const { uploadProfile } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/create', addUser);
    router.post('/login', login);

    //admin controls
    router.get('/all', authorizeAccessControll, getAll);
    router.get('/:userid', authenticateToken, findUser);
    router.use('/getprofile', express.static('src/uploads/profile/'));

    //profile
    router.put('/me/update/:userid', authorizeValidateUser, meUpdateUser);
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, changeEmail);
    router.put('/me/changeUsername/:userid', authorizeValidateUser, changeUsername);

    return router;
};
