import dbConnect from "../../../../lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

//Query schema

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  // Request type verification
  //  TODO use this logic in all requests
  // Now in the latest version of next js not need to use this logic next js automatically handles it
  //console.log(`Received method type from request: ${req.method}`);
  if (req.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Method not allowed",
      },
      { status: 405 }
    );
  }

  await dbConnect();
  //  example url : localhost:3000/api/check-unique-username?username=rishabh?phone=9685791791
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //Validate with zod schema
    // this result variable holds all thing including errors , data and all other things
    const result = UsernameQuerySchema.safeParse(queryParam);
    // safeparse method is only used for parsing safe means following schema requirements are met
    console.log(result); //TODO remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      // username?._errors indicate that ho skta h optionally ki uske paas errors ho username me
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking unique username", error);
    return Response.json(
      { success: false, message: "Failed to check unique username" },
      {
        status: 500,
      }
    );
  }
}
