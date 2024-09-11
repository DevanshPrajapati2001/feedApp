import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpires = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeExpires) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeExpires) {
      return Response.json(
        {
          success: false,
          message: "Verification code has been expired,sign up again",
        },
        { status: 403 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid Verification Code ",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error while verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
