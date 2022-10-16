import { NextApiHandler } from "next/types";
import OAuth from "../../../src/services/oauth";

const Login: NextApiHandler = async (req, res) => {
	if (req.method !== "GET") return res.status(405).end();
	await OAuth.handleRedirect(req, res);
};

export default Login;
