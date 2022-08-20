import express from "express";
import LoginProcessor from "../services/login.processor.service";
import CreateUserService from "../services/user.registeration.service";
import SuccessDataResult from "../utils/results/successDataResult";
import authenticator from "../middleware/authenticator";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const { name, tag, age, area, email, password } = req.body;

    const createUserService = new CreateUserService();

    const userProfile = await createUserService.execute(
      name,
      tag,
      age,
      area,
      email,
      password
    );

    return res.json(
      new SuccessDataResult({
        userID: userProfile.id,
      })
    );
  } catch (err) {
    return next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userLogin = new LoginProcessor();
    const user = await userLogin.execute(email, password);

    res.send(
      new SuccessDataResult({
        user: user,
      })
    );
  } catch (err) {
    return next(err);
  }
});

export default userRouter;
