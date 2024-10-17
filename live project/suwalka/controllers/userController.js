import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from  'multer'
import path from 'path'; 
import fs from 'fs';

class UserController {
          static UserRegistration = async (req, res) => {
                  const { first_name,last_name, username, password, password_confirmation, gender } = req.body
                  const user = await UserModel.findOne({ username: username })
                  if (user) {
                    res.send({ "status": "failed", "message": "Username already exists" })
                  } else {
                    if (first_name && last_name && username && password && password_confirmation && gender) {
                      if (password === password_confirmation) {
                        try {
                          const salt = await bcrypt.genSalt(10)
                          const hashPassword = await bcrypt.hash(password, salt)
                          const doc = new UserModel({
                            first_name: first_name,
                            last_name: last_name,
                            username: username,
                            gender:gender,
                            password: hashPassword
                          })
                          await doc.save()
                          const saved_user = await UserModel.findOne({ username: username })
                          // Generate JWT Token
                          const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                          res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
                        } catch (error) {
                          console.log(error)
                          res.send({ "status": "failed", "message": "Unable to Register",error:error })
                        }
                      } else {
                        res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
                      }
                    } else {
                      res.send({ "status": "failed", "message": "All fields are required" })
                    }
                  }
            } 

            static UserLogin = async (req, res) => {
               try {
                const { username, password } = req.body
                    if (username && password) {
                      const user = await UserModel.findOne({ username: username })
                      if (user != null) {
                        const isMatch = await bcrypt.compare(password, user.password)
                        if ((user.username === username) && isMatch) {
                          // Generate JWT Token
                          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                          res.send({ "status": "success", "message": "Login Success", "token": token })
                        } else {
                          res.send({ "status": "failed", "message": "Email or Password is not Valid" })
                        }
                      } else {
                        res.send({ "status": "failed", "message": "You are not a Registered User" })
                      }
                    } else {
                      res.send({ "status": "failed", "message": "All Fields are Required" })
                    }
                  } catch (error) {
                    console.log(error)
                    res.send({ "status": "failed", "message": "Unable to Login" })
                  }
            }
    
  static getList = async (req, res) => {                  
              const data = await UserModel.find({})
              const currentFileUrl = import.meta.url;

// Convert the URL to a file path
const currentFilePath = new URL(currentFileUrl).pathname;

// Get the directory name of the file
const currentDirName = path.dirname(currentFilePath);
              data.image_url = currentDirName;
              if (data != null){
                res.send({ "status": "success", "message": "All data",data:data })
              }
              else{
                res.send({ "status": "Faild", "message": "no data"})
              }
      }
   

      static changePassword = async (req, res) => {
                const { password, password_confirmation } = req.body
                if (password && password_confirmation) {
                  if (password !== password_confirmation) {
                    res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
                  } else {
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
                    res.send({ "status": "success", "message": "Password changed succesfully" })
                  }
                } else {
                  res.send({ "status": "failed", "message": "All Fields are Required" })
                }
        }


        static changeProfile = async (req, res) => {
                const { last_name, district } = req.body
                try{
                    await UserModel.findByIdAndUpdate(req.user._id, { $set: { last_name: last_name, district:district} })
                    res.send({ "status": "success", "message": "Profile changed succesfully" })
                  }
                catch {
                  res.send({ "status": "failed", "message": "Something wrong validation" })
                }
          }

  static imageupload = async (req, res) => {
            console.log(req.userID);
            try {
              const config = multer.diskStorage({
                destination: (req, file, callback) => {
                  callback(null, "./uploads/user");
                },
                filename: (req, file, callback) => {
                  callback(null, `image-${Date.now()}.${file.originalname}`);
                },
              });
        
              const isimage = (req, file, callback) => {
                if (file.mimetype.startsWith("image")) {
                  callback(null, true);
                } else {
                  callback(new Error("only images allowed"));
                }
              };
        
              const upload = multer({
                storage: config,
                fileFilter: isimage,
              }).single("photo");
        
              upload(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                  return res.status(400).json({ message: "Error uploading file" });
                } else if (err) {
                  return res.status(400).json({ message: err.message });
                }
        
                if (!req.file) {
                  return res.status(400).json({ message: "No image file provided" });
                }
        
                const imageUrl = req.file.path;

                // const id = req.params.id;
                // const userID = req.user._id
                const newValue = { image:imageUrl }
                // console.log("newValue");
                // console.log(newValue);
                // console.log(req);
                const userID = req.userID;
                try{
                  const oldImage = await UserModel.findOne({"_id":userID,"isDelete":false});
                  // console.log("oldImage");
                  // console.log(oldImage);
                  // console.log(oldImage.image);
                  
                 this.oldImageDelete(oldImage.image);
                 
                 // await UserModel.findByIdAndUpdate(req.user._id, { $set: newValue }) it also work 
                  await UserModel.findByIdAndUpdate(userID, { $set: newValue })
                  if(oldImage.image.length>0)
                      res.send({ "status": "success", "message": "Profile Image changed  upload succesfully" })
                  else
                    res.send({ "status": "success", "message": "Profile Image upload succesfully" })
                }
              catch {
                res.send({ "status": "failed", "message": "Something wrong validation" })
              }

                // Save the imageUrl to the database or perform any other actions here
              //  res.status(200).json({ imageUrl });
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: "Server error" });
            }
          };
          static  oldImageDelete(filePath)
          {
            console.log("filePath");
            console.log(filePath);
                  fs.unlink(filePath, (err) => {
                          if (err) {
                              console.error('Error while deleting file:', err);
                              return ;
                          }
                          console.log('File has been successfully deleted');
                          
                  });

          }

          static imagedelete = async (req, res) => {
            const newValue = { image:'' }                
                const userID = req.userID;
                try{
                  const oldImage = await UserModel.findOne({"_id":userID,"isDelete":false});
                  // console.log("oldImage");
                  // console.log(oldImage);
                  // console.log(oldImage.image);                  
                
                  if(oldImage.image.length>0){
                      this.oldImageDelete(oldImage.image);
                      await UserModel.findByIdAndUpdate(userID, { $set: newValue })
                      res.send({ "status": "success", "message": "Profile Image Delete succesfully " })
                    }
                  else
                    res.send({ "status": "success", "message": "Profile Image Not Found" })
                }
              catch {
                res.send({ "status": "failed", "message": "Something wrong validation" })
              }
          }

}

export default UserController