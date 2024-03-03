const UserModel = require("./UserModel");
const userView = require("./userView");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getToken } = require("../../../config/token");
require("dotenv").config(); // Load environment variables

const login = (req, res) => {
  const { username, password } = req.body;

  UserModel.getUserByUsernameAndPassword(
    username,
    password,
    (error, results) => {
      if (error) {
        console.error("Error fetching data from the database:", error);
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (Array.isArray(results) && results.length > 0) {
        const user = results[0];


          const token = generateToken(
            user.email
          );

          if (token) {
            userView.renderUser(res, user, token);
            return;
          }

          res.status(401).send({ error: "Server error" });
          return;
      
      }

      res.status(401).send({ error: "Invalid username or password" });
    }
  );
};

const getAll = (req, res) => {
  UserModel.getAll((error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    res.status(200).send(results); // Modify the response as per your requirement
  });
};

getUserById = (req, res) => {
  const { userid } = req.params;
  UserModel.getUserById(userid, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(200).send(results);
  });
};

const findUser = (req, res) => {
  const { userid } = req.params;
  UserModel.getUserById(userid, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(200).send(results);
  });
};

const addUser = (req, res) => {
  const user = req.body; 
  
  // Email validation regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email is valid
  if (!emailRegex.test(user.email)) {
    res.status(400).send({ error: "Invalid email format" });
    return;
  }

  //console.log(user);

  UserModel.addUser(user, (error, userId) => {
    if (error) {
      res
        .status(500)
        .send({ error: "Error fetching data from the database" });
      return;
    }

    if (!userId) {
      res.status(500).send({ error: "Failed to create user" });
      return;
    }

    res.status(200).send({
      message: "User created successfully",
      userId,
    });
  });
};

// const updateUser = (req, res) => {
//   const { userid } = req.params;
//   const user = req.body;

//   UserModel.getUserById(userid, (error, existingUser) => {
//     if (error) {
//       res.status(500).send({ error: "Error fetching data from the database" });
//       return;
//     }

//     if (!existingUser[0]) {
//       res.status(404).send({ error: "User not found" });
//       return;
//     }

//     // Check if the provided phone number is already associated with another user
//     if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) {
//       UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
//         if (error) {
//           res
//             .status(500)
//             .send({ error: "Error fetching data from the database" });
//           return;
//         }

//         if (results.length > 0) {
//           res.status(409).send({ error: "Phone number already exists" });
//           return;
//         }

//         updateExistingUser(user, userid);
//       });
//     } else {
//       updateExistingUser(user, userid);
//     }
//   });

//   function updateExistingUser(user, userid) {
//     UserModel.updateUser(user, userid, (error, results) => {
//       if (error) {
//         res
//           .status(500)
//           .send({ error: "Error fetching data from the database" });
//         return;
//       }

//       if (results.affectedRows === 0) {
//         res.status(404).send({ error: "User not found or no changes made" });
//         return;
//       }

//       res.status(200).send({ message: "User updated successfully" });
//     });
//   }
// };

// const validateUser = (req, res) => {
//   const { token } = req.params;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const email = decoded.email; // Use the correct field name from the token

//     UserModel.getUserByEmail(email, async (error, existingUsers) => {
//       if (error) {
//         return res
//           .status(500)
//           .send({ error: "Error fetching data from the database" });
//       }

//       if (!existingUsers[0]) {
//         return res.status(404).send({ error: "Dealer not found" });
//       }

//       UserModel.updatestatus(
//         existingUsers[0].userid,
//         1,
//         (updateError, updateResult) => {
//           if (updateError) {
//             return res
//               .status(500)
//               .send({ error: "Error updating dealer status" });
//           } else {
//             // Prepare the HTML response
//             const redirectUrl = "https://mail.google.com"; // Replace with the Gmail URL you want to redirect to
//             const htmlResponse = `
//                     <!DOCTYPE html>
//                     <html lang="en">
//                     <head>
//                         <meta charset="UTF-8">
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <title>Thank You for Join with Us</title>
//                         <style>
//                             body {
//                                 font-family: Arial, sans-serif;
//                                 text-align: center;
//                                 padding: 50px;
//                             }
//                             h1 {
//                                 color: #333;
//                             }
//                             p {
//                                 color: #777;
//                                 margin-top: 20px;
//                             }
//                         </style>
//                     </head>
//                     <body>
//                         <h1>Thank You!</h1>
//                         <p>Your Account has been successfully verified.</p>
//                         <script>
//                             setTimeout(function() {
//                                 window.location.href = "${redirectUrl}";
//                             }, 2000); // Adjust the delay time as needed
//                         </script>
//                     </body>
//                     </html>
//                 `;
//             return res.status(200).send(htmlResponse);
//           }
//         }
//       );
//     });
//   } catch (tokenError) {
//     return res.status(400).send({ error: "Token is invalid or expired" });
//   }
// };

const meUpdateUser = (req, res) => {
  const { userid } = req.params;
  const user = req.body;

  UserModel.getUserById(userid, (error, existingUser) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!existingUser[0]) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    // Check if the provided phone number is already associated with another user
    if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) {
      UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }

        if (results.length > 0) {
          res.status(409).send({ error: "Phone number already exists" });
          return;
        }

        updateExistingUser(user, userid);
      });
    } else {
      updateExistingUser(user, userid);
    }
  });

  function updateExistingUser(user, userid) {
    UserModel.meUpdateUser(user, userid, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: "User not found or no changes made" });
        return;
      }

      res.status(200).send({ message: "User updated successfully" });
    });
  }
};

const updateUserProfile = (req, res) => {
  const { userid } = req.params;
  const filePath = req.file.filename;

  UserModel.getUserById(userid, (error, existingUser) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!existingUser[0]) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    UserModel.updateUserProfile(userid, filePath, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: "User not found or no changes made" });
        return;
      }

      res.status(200).send({ message: "User updated successfully" });
    });
  });
};

const changePassword = (req, res) => {
  const { userid } = req.params;
  const { currentPassword, password } = req.body;

  // Check if current password is empty
  if (!currentPassword) {
    res.status(400).send({ error: "Current password is required" });
    return;
  }

  // Check if new password is empty
  if (!password) {
    res.status(400).send({ error: "New password is required" });
    return;
  }

  UserModel.getUserById(userid, (error, user) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!user[0]) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    // Compare the current password with the stored password hash using bcrypt
    bcrypt.compare(currentPassword, user[0].password, (err, isMatch) => {
      if (err) {
        res.status(500).send({ error: "Error comparing passwords" });
        return;
      }

      if (!isMatch) {
        res.status(400).send({ error: "Current password is incorrect" });
        return;
      }

      UserModel.updateUserPassword(userid, password, (updateErr, results) => {
        if (updateErr) {
          res
            .status(500)
            .send({ error: "Error updating password in the database" });
          return;
        }

        res.status(200).send({ message: "Password changed successfully" });
      });
    });
  });
};

const changeEmail = (req, res) => {
  const { userid } = req.params;
  const { currentEmail, newEmail } = req.body;

  // Email validation regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if current email is empty or not in the correct format
  if (!currentEmail || !emailRegex.test(currentEmail)) {
    return res.status(400).json({ error: "Invalid or missing current email" });
  }

  // Check if new email is empty or not in the correct format
  if (!newEmail || !emailRegex.test(newEmail)) {
    return res.status(400).json({ error: "Invalid or missing new email" });
  }

  UserModel.getUserById(userid, (error, user) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error fetching data from the database" });
    }

    if (!user || !user[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user[0].email !== currentEmail) {
      return res.status(400).json({ error: "Current email is incorrect" });
    }

    UserModel.changeEmail(userid, newEmail, (updateError, results) => {
      if (updateError) {
        return res
          .status(500)
          .json({ error: "Error updating email in the database" });
      }

      const verificationToken = getToken(newEmail, "1h");
      sendVerificationEmail(newEmail, verificationToken);

      UserModel.updatestatus(user[0].userid, 0, (updateStatusError) => {
        if (updateStatusError) {
          return res.status(500).json({ error: "Error updating user status" });
        }

        return res
          .status(200)
          .json(
            "You have to verify the new email before logging into the system"
          );
      });
    });
  });
};

const changeUsername = (req, res) => {
  const { userid } = req.params;
  const { currentUsername, newUsername } = req.body;

  if (!currentUsername) {
    res.status(400).send({ error: "Current username is required" });
    return;
  }

  if (!newUsername) {
    res.status(400).send({ error: "New username is required" });
    return;
  }

  UserModel.getUserById(userid, (error, user) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!user[0]) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    UserModel.getUserByUsername(currentUsername, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.length == 0) {
        res.status(409).send({ error: "Current Username is Wrong" });
        return;
      }

      UserModel.getUserByUsername(newUsername, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }

        if (results.length > 0) {
          res.status(409).send({ error: "New username already exists" });
          return;
        }

        UserModel.changeUsername(userid, newUsername, (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error updating username in the database" });
            return;
          }

          res.status(200).send({ message: "Username changed successfully" });
        });
      });
    });
  });
};

function generateToken(email) {
  const payload = { email };
  const options = { expiresIn: "24h" }; // Token expiration time

  // Sign the token with the secret key from the .env file
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

module.exports = {
  login,
  getAll,
  findUser,
  addUser,
  changePassword,
  changeEmail,
  updateUserProfile,
  meUpdateUser,
  changeUsername,
};
