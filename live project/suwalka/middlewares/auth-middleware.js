import jwt from 'jsonwebtoken'
import ParentModel from '../models/user.js'
import UserModel from '../models/user.js'
var checkUserAuth = async (req, res, next) => {
          let token
          const { authorization } = req.headers
          if (authorization && authorization.startsWith('Bearer')) {
                  try {
                        
                        token = authorization.split(' ')[1] ;
                        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
                        req.user = await UserModel.findById(userID).select('-password');
                        req.userID = req.user._id; // i set userId with req to access any where req
                        next()
                  } catch (error) {
                          console.log(error)
                          res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
                    }
                }
                if (!token) {
                  res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
          }
}

export default checkUserAuth