import express from "express";
import cors from "cors";
import USER from "./models/user.model/user.model.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import ORG from "./models/org.model/org.model.js";
import authMiddleware from "./middleware/auth-middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const secret = "secretauth0199829429378479";

connectDB();

// Signup Route
app.post("/auth/sign-up", async (req, res) => {
  try {
    const { username, email, password } = await req.body;

    const existUser = await USER.findOne({ email: email });

    if (existUser) {
      return res.status(411).send({
        message: "Email is already used please try different email...",
      });
    }

    const user = USER.create({
      username,
      email,
      password,
    });

    const token = Jwt.sign(
      {
        userId: user._id,
      },
      secret,
    );

    // Store token into cookie

    res.cookie("userCookie", token, {
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
    });

    return res.json({
      message: "Account is successFully created",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server issue",
    });
  }
});

// sign-in route

app.post("/auth/sign-in", async (req, res) => {
  try {
    const { email, password } = await req.body;

    const existUser = await USER.findOne({ email: email, password: password });

    if (!existUser) {
      return res.status(411).send({
        message: "Incorrect email and password",
      });
    }

    const token = Jwt.sign(
      {
        userId: existUser._id,
      },
      secret,
    );

    res.cookie("userCookie", token, {
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
    });

    return res.status(200).send({
      message: "You sucessFully login",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server issue",
    });
  }
});

// Create Org

// this is authenticatd route
app.post("/onboarding/create-org", authMiddleware, async (req, res) => {
  try {
    const { orgName, email, orgDesc } = await req.body;
    const userId = await req.userId;

    if (!userId) {
      return res.status(411).send({
        message: "User is not authenticated",
      });
    }

    if (!orgName || !email || !orgDesc) {
      return res.status(411).send({
        message: "Input field is required",
      });
    }

    await ORG.create({
      orgName,
      email,
      orgDesc,
      ownerId: userId,
    });

    return res.status(200).send({
      message: "Org is created successFully",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

// find the org List
app.get("/org/org-list", authMiddleware, async (req, res) => {
  try {
    const userId = await req.userId;
    if (!userId) {
      return res.status(411).send({
        message: "User is not authenticated",
      });
    }

    const orgList = await ORG.find({ ownerId: userId });

    if (!orgList) {
      return res.status(411).send({
        message: "No org list",
      });
    }

    return res.status(200).json({
      data: orgList,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});




app.listen(3000);
