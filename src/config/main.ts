import dotenv from "dotenv";
dotenv.config();

export const API_PORT = process.env.PORT || 3000;
export const HOST:string = process.env.HOST || "localhost";
export const MONGO_URI: string = process.env.DB_URI!;

export const TOKEN_KEY = process.env.TOKEN_KEY;
