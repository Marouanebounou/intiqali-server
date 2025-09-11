import { Router } from "express";
import User from "../models/User.js";

const router = Router();
//sender is first and reciver is second
router.post("/send-request/:userId/:reciverId", async (req, res) => {
  try {
    const sender = await User.findById(req.params.userId);
    const reciver = await User.findById(req.params.reciverId);
    var pending = false;
    if (!sender || !reciver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are already friends
    const alreadyFriends =
      sender.friends.some((f) => f.id.toString() === reciver._id.toString()) ||
      reciver.friends.some((f) => f.id.toString() === sender._id.toString());
    if (alreadyFriends) {
      return res.status(400).json({ message: "Users are already friends" });
    }
    const isHeSendMeInvitation = sender.friendsRequests.some(
      (f) => f.id.toString() === reciver._id.toString()
    );
    if (isHeSendMeInvitation) {
      return res
        .status(400)
        .json({ message: "This user has already sent you a request" });
    }
    // Check if a request has already been sent
    const isRequestSent =
      sender.requestSent.some(
        (f) => f.id.toString() === reciver._id.toString()
      ) ||
      reciver.friendsRequests.some(
        (f) => f.id.toString() === sender._id.toString()
      );
    if (isRequestSent) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    sender.requestSent.push({
      id: reciver._id,
      name: reciver.firstName + " " + reciver.lastName,
      profileImage: reciver.profileImage,
      ministère: reciver.ministère,
      fonction: reciver.fonction,
      ville: reciver.ville,
      etablissement: reciver.etablissement,
    });
    reciver.friendsRequests.push({
      id: sender._id,
      name: sender.firstName + " " + sender.lastName,
      profileImage: sender.profileImage,
      ministère: sender.ministère,
      fonction: sender.fonction,
      ville: sender.ville,
      etablissement: sender.etablissement,
    });
    await sender.save();
    await reciver.save();
    pending = true;
    res.status(200).json({ message: "Friend request sent", pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/accept-request/:senderId/:reciverId", async (req, res) => {
  try {
    const sender = await User.findById(req.params.senderId);
    const reciver = await User.findById(req.params.reciverId);
    if (!sender || !reciver) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if they are already friends
    const alreadyFriends =
      sender.friends.some((f) => f.id.toString() === reciver._id.toString()) ||
      reciver.friends.some((f) => f.id.toString() === sender._id.toString());
    if (alreadyFriends) {
      return res.status(400).json({ message: "Users are already friends" });
    }
    sender.friends.push({
      id: reciver._id,
      name: reciver.firstName + " " + reciver.lastName,
      profileImage: reciver.profileImage,
      ministère: reciver.ministère,
      fonction: reciver.fonction,
      ville: reciver.ville,
      etablissement: reciver.etablissement,
    });

    reciver.friends.push({
      id: sender._id,
      name: sender.firstName + " " + sender.lastName,
      profileImage: sender.profileImage,
      ministère: sender.ministère,
      fonction: sender.fonction,
      ville: sender.ville,
      etablissement: sender.etablissement,
    });
    // Remove from sender's requestSent array
    sender.requestSent = sender.requestSent.filter(
      (request) => request.id.toString() !== reciver._id.toString()
    );
    // Remove from receiver's friendsRequests array
    reciver.friendsRequests = reciver.friendsRequests.filter(
      (request) => request.id.toString() !== sender._id.toString()
    );
    await sender.save();
    await reciver.save();
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reject-request/:senderId/:reciverId", async (req, res) => {
  try {
    const reciver = await User.findById(req.params.reciverId);
    const sender = await User.findById(req.params.senderId);
    // check if they are already friends
    const alreadyFriends =
      sender.friends.some((f) => f.id.toString() === reciver._id.toString()) ||
      reciver.friends.some((f) => f.id.toString() === sender._id.toString());
    if (alreadyFriends) {
      res.status(400).json({ message: "Users are already friends" });
    }
    if (!sender || !reciver) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      !reciver.friendsRequests.some(
        (request) => request.id.toString() === sender._id.toString()
      ) ||
      !sender.requestSent.some(
        (request) => request.id.toString() === reciver._id.toString()
      )
    ) {
      return res.status(400).json({ message: "No friend request to reject" });
    }
    // Remove the request object from receiver
    reciver.friendsRequests = reciver.friendsRequests.filter(
      (request) => request.id.toString() !== sender._id.toString()
    );
    // Remove the request object from sender
    sender.requestSent = sender.requestSent.filter(
      (request) => request.id.toString() !== reciver._id.toString()
    );

    await reciver.save();
    await sender.save();
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/list/requestSent/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("requestSent");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/list/requestRecived/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("friendsRequests");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/list/friends/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("friends");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/remove-friend/:userId/:friendId", async (req, res) => {
  try {
    const reciver = await User.findById(req.params.userId);
    const sender = await User.findById(req.params.friendId);
    if (!sender || !reciver) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if they are friends
    const alreadyFriends =
      sender.friends.some((f) => f.id.toString() === reciver._id.toString()) ||
      reciver.friends.some((f) => f.id.toString() === sender._id.toString());
    if (!alreadyFriends) {
      return res.status(400).json({ message: "Users are not friends" });
    }
    sender.friends = sender.friends.filter(
      (f) => f.id.toString() !== reciver._id.toString()
    );
    reciver.friends = reciver.friends.filter(
      (f) => f.id.toString() !== sender._id.toString()
    );
    await sender.save();
    await reciver.save();
    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/cancel-request/:userId/:reciverId", async (req, res) => {
  try {
    const sender = await User.findById(req.params.userId);
    const reciver = await User.findById(req.params.reciverId);
    if (!sender || !reciver) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if a request has been sent
    const isRequestSent =
      sender.requestSent.some(
        (f) => f.id.toString() === reciver._id.toString()
      ) ||
      reciver.friendsRequests.some(
        (f) => f.id.toString() === sender._id.toString()
      );
    if (!isRequestSent) {
      return res.status(400).json({ message: "No friend request to cancel" });
    }
    // Remove the request from receiver.friendsRequests
    await User.findByIdAndUpdate(reciver._id, {
      $pull: { friendsRequests: { id: sender._id } },
    });

    // Remove the request from sender.requestSent
    await User.findByIdAndUpdate(sender._id, {
      $pull: { requestSent: { id: reciver._id } },
    });

    await sender.save();
    await reciver.save();
    res.status(200).json({ message: "Friend request canceled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/block-user/:userId/:blockedId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const toBlock = await User.findById(req.params.blockedId);
    if (!user || !toBlock) {
      return res.status(404).json({ message: "User not found" });
    }
    const isAlreadyBlocked = user.blocked.some(
      (b) => b.id.toString() === toBlock._id.toString()
    );
    if (isAlreadyBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    }
    user.blocked.push({
      id: toBlock._id,
      name: toBlock.firstName + " " + toBlock.lastName,
      profileImage: toBlock.profileImage,
    });
    await user.save();
    res.status(200).json({ message: "User blocked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/unblock-user/:userId/:blockedId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const toUnblock = await User.findById(req.params.blockedId);
    if (!user || !toUnblock) {
      return res.status(404).json({ message: "User not found" });
    }
    const isBlocked = user.blocked.some(
      (b) => b.id.toString() === toUnblock._id.toString()
    );
    if (!isBlocked) {
      return res.status(400).json({ message: "User is not blocked" });
    }
    user.blocked = user.blocked.filter(
      (b) => b.id.toString() !== toUnblock._id.toString()
    );
    await user.save();
    res.status(200).json({ message: "User unblocked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/list/blocked/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("blocked");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
