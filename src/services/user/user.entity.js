import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user.schema';
import { sendOtpTemplate } from '../../controllers/email/template';


/**
 * Creates a new user in the database with the specified properties in the request body.
 * The 'role' property is automatically set to 'user', and the 'password' property is hashed using bcrypt.
 *
 * @param {Object} req - The request object containing the properties for the new user.
 * @param {Object} db - The database object for interacting with the database.
 * @returns {Object} The created user object, including the JWT token.
 * @throws {Error} If the request body includes properties other than those allowed or if there is an error during the database operation.
 */
export const register = ({ db }) => async (req, res) => {
  try {

    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = await db.create({ table: User, key: { ...req.body } });
    user ? res.status(201).send(user) : res.status(400).send('Something wents wrong');
  }
  catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong.');
  }
};



/**
 * This function is used for login a user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const login = ({ db, settings }) => async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) return res.status(400).send('Bad request');
    const user = await db.findOne({ table: User, key: { email: req.body.email, populate: { path: 'agency hotel'} } });
    if (!user) return res.status(401).send('No user exist with this email');
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(401).send('Wrong Password');
    const token = jwt.sign({ id: user.id }, settings.SECRET);
    res.cookie(settings.SECRET, token, {
      httpOnly: true,
      ...(settings.useHTTP2 && {
        sameSite: "None",
        secure: true,
      }),
      ...(!req.body.rememberMe && {
        expires: new Date(Date.now() + 172800000 /*2 days*/),
      }),
    });
    res.status(200).send(user);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};


/**
 * This function is used for load a user profile from request header.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const me = () => async (req, res) => {
  try {
    res.status(200).send(req.user);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};


/**
 * This function is used for logout a user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const logout = ({ settings }) => async (req, res) => {
  try {
    res.clearCookie(settings.SECRET, {
      httpOnly: true,
      ...(settings.useHTTP2 && {
        sameSite: "None",
        secure: true,
      }),
      expires: new Date(Date.now()),
    });
    return res.status(200).send('Logout successful');
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};


/**
 * This function is used get all users in the database by query.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns a object, that contains resulted data and other information like page, limit.
 */
export const getAll = ({ db }) => async (req, res) => {
  try {
    const users = await db.find({ table: User, key: { query: req.query, allowedQuery: allowedQuery, paginate: req.query.paginate === 'true' } });
    res.status(200).send(users);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};


/**
 * This function is used to find a user by id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data of the id otherwise no result found with status 404 .
 */
export const userProfile = ({ db }) => async (req, res) => {
  try {
    const user = await db.findOne({ table: User, key: { id: req.params.id, populate: { path: 'role', select: 'name department' } } });
    if (!user) return res.status(404).send('No result found');
    res.status(200).send(user);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};


const setPassword = async ({ oldPass, newPass, user }) => {
  if (!oldPass || !newPass) throw ({ status: 400, reason: 'bad request' });
  const isValid = await bcrypt.compare(oldPass, user.password);
  if (!isValid) throw ({ status: 401, reason: 'Invalid old Password' });
  return await bcrypt.hash(newPass, 8);
};

/**
 * This function is used to update user own profile.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated data.
 */
export const updateOwn = ({ db }) => async (req, res) => {


  try {
    if (req?.body?.password && req?.body?.newPassword) {
      req.body.password = await setPassword({
        oldPass: req.body.password,
        newPass: req.body.newPassword,
        user: req.user,
      });
      delete req.body.newPassword;
    }
    Object.keys(req.body).forEach((k) => (req.user[k] = req.body[k]));
    const user = await db.save(req.user);
    if (!user) return res.status(400).send('Profile update unsuccessfull');
    await db.populate(user, { path: 'hotel agency' });
    console.log(user);
    res.status(200).send(user);
  }
  catch (err) {
    console.log(err);
    res.status(err.status || 500).send(err.reason || 'Something went wrong');
  }
};


/**
 * This function is used update a user by admin, admin can update without only password and notifySubs.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the updated data.
 */
export const updateUser = ({ db, imageUp }) => async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data || '{}');
    if (req.files?.avatar?.path) {
      req.body.avatar = await imageUp(req.files?.avatar.path);
    }
    const user = await db.findOne({ table: User, key: { id: req.params.id } });
    if (!user) return res.status(400).send('Bad request');
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 8);
    Object.keys(req.body).forEach(k => (user[k] = req.body[k]));
    await db.save(user);
    res.status(200).send(user);
  }
  catch (err) {
    console.log(err);
    res.status(err.status || 500).send(err.reason || 'Something went wrong');
  }
};


export const remove = ({ db }) => async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.remove({ table: User, key: { id } });
    if (!user) return res.status(404).send({ messae: 'User not found' });
    res.status(200).send({ message: 'Deleted Successfully' });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Something went wrong' });
  }
};


export const forgotPassword = ({db, settings, mail}) => async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send('Bad request');
    const user = await db.findOne({ table: User, key: { email } });
    if (!user) return res.status(400).send("Bad request");
    const otp = Math.floor(1000 + Math.random() * 9000);
    const token = jwt.sign({ email, otp, time: new Date() }, settings.SECRET);
     const mailRes = await mail({
       receiver: email,
       subject: "TripTrekker- Password Reset OTP",
       body: sendOtpTemplate(otp),
       type: "html",
     });
     if (!mailRes) return res?.status(400).send("Forbidden");
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });

  }
}


export const verifyOtp = ({settings}) => async (req, res) => {
  try {
    const { email, token, otp } = req.body;
    if (!email || !token || !otp) return res.status(400).send('Bad request');
    const decryptedToken = jwt.verify(token, settings.SECRET);
    if (decryptedToken.email !== email) return res.status(400).send('Bad Request');
    if (decryptedToken.otp !== otp) return res.status(400).send("Invalid Otp");
    if(Math.abs(new Date() - new Date(decryptedToken.time))>300000) return res.status(400).send("Otp has been expired");
    const newToken = jwt.sign({ email, time: new Date() }, settings.SECRET);
    res.status(200).send(newToken);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });

  }
}


export const ResetPassword = ({ db, settings }) => async (req, res) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) return res.status(400).send("Bad request");
    const decryptedToken = jwt.verify(token, settings.SECRET);
    if (decryptedToken.email !== email) return res.status(400).send("Bad Request");
    if (Math.abs(new Date() - new Date(decryptedToken.time)) > 300000) return res.status(400).send("Otp has been expired");
    const newPassword = await bcrypt.hash(password, 8);
    const user = await db.findOne({ table: User, key: { email: email } });
    if (!user) return res.status(400).send("Bad request");
    user.password = newPassword;
    await db.save(user);
    return res.status(200).send(user)



  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });

  }
}