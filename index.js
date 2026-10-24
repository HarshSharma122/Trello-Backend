import express from "express";
import cors from "cors";
import USER from "./models/user.model/user.model.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import ORG from "./models/org.model/org.model.js";
import authMiddleware from "./middleware/auth-middleware.js";
import BOARDS from "./models/boards.model/boards.model.js";

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
    const { orgname, email, orgDesc } = await req.body;
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
      orgname,
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

// delete the org

app.delete("/org/:orgId", authMiddleware, async (req, res) => {
  try {
    const orgId = req.params.orgId;

    if (!orgId) {
      return res.status(411).send({
        message: "Np org id found",
      });
    }

    await ORG.findByIdAndDelete(orgId);

    return res.status(200).send({
      message: "Org Deleted successFully",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/create-board", authMiddleware, async (req, res) => {
  try {
    const { boardname, orgId } = await req.body;
    const userId = await req.userId;

    if (!userId) {
      return res.status(411).send({
        message: "User is not authenticated",
      });
    }

    if (!boardname || !orgId) {
      return res.status(411).send({
        message: "Input field is required",
      });
    }

    await BOARDS.create({
      boardname,
      orgId,
      ownerId: userId,
    });

    return res.status(200).send({
      message: "Board successFully created",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/board/list/:orgId", authMiddleware, async (req, res) => {
  try {
    const orgId = req.params.orgId;
    const boardList = await BOARDS.find({ orgId: orgId });
    if (!boardList) {
      return res.status(411).send({
        message: "No board list for this org",
      });
    }

    return res.status(200).json({
      data: boardList,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/board/member-add", authMiddleware, async (req, res) => {
  try {
    const { email, boardId } = await req.body;
    const userId = await req.userId;

    if (!userId) {
      return res.status(411).send({
        message: "User is not authenticated",
      });
    }

    if (!email || !boardId) {
      return res.status(411).send({
        message: "Input field is required",
      });
    }

    const board = await BOARDS.findById(boardId);

    if (!board) {
      return res.status(411).send({
        message: "No board found",
      });
    }

    board.boardMembers.push(email);

    await board.save();

    return res.status(200).send({
      message: "member successFully added",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/board/add-list", authMiddleware, async (req, res) => {
  try {
    const { listname, boardId } = await req.body;
    const userId = await req.userId;

    if (!userId) {
      return res.status(411).send({
        message: "User is not authenticated",
      });
    }

    if (!listname || !boardId) {
      return res.status(411).send({
        message: "Input field is required",
      });
    }

    const board = await BOARDS.findById(boardId);

    if (!board) {
      return res.status(411).send({
        message: "No board found",
      });
    }

    board.boardList.push({
      listname: listname,
    });

    await board.save();

    return res.status(200).send({
      message: "Done",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

app.post("/board/add-card", authMiddleware, async (req, res) => {
  try {
    const { cardDesc, listId, boardId } = await req.body;
    const userId = await req.userId;

    if (!userId) {
      return res.status(411).send({
        message: "User is not authenticated",
      });
    }

    if (!cardDesc || !boardId) {
      return res.status(411).send({
        message: "Input field is required",
      });
    }

    const board = await BOARDS.findById(boardId);

    if (!board) {
      return res.status(411).send({
        message: "No board found",
      });
    }

    const ans = board.boardList.find((list) => list._id == listId);

    ans.cards.push({
      cardDesc: cardDesc,
    });

    await board.save();


    return res.status(200).send({
      message: "Done",
      data:board
    });
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
});

app.listen(3000);
