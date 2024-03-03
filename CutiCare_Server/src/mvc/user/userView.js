const userView = {
    renderUser(res, user, token) {
        const { userid, fullname, username, email, phone, address, gender , nic } = user;

        const data = {
            userData: {
                fullname,
                email,
                username,
                phone,
                address,
                gender,
                nic
            },
            userid,
            token
        }

        res.send(data);
    },
};

module.exports = userView;
