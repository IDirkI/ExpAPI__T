import express from "express";
import CreateUserService from "../services/user.registeration.service";
import SuccessDataResult from "../utils/results/successDataResult";

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
      password,
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

export default userRouter;
