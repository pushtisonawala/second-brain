"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_js_1 = require("./db.js");
const mid_1 = require("./middleware/mid");
dotenv_1.default.config();
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield db_js_1.userModel.create({ username, password });
        res.json({ message: "Signup successful", user });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: "Signup failed", details: error.message });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield db_js_1.userModel.findOne({ username, password });
        if (!existingUser) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, JWT_PASSWORD, {
            expiresIn: "1h",
        });
        res.json({ message: "Signin successful", token });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ error: "Error logging in", details: error.message });
    }
}));
app.post("/api/v1/content", mid_1.mid, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = req.body.link;
        const type = req.body.type;
        yield db_js_1.contentModel.create({
            link,
            type,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        res.json("Content added");
    }
    catch (err) {
        const error = err;
        res.json("Content cant be added");
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log("Connected to MongoDB");
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
        }
        catch (err) {
            const error = err;
            console.error(" Error connecting to DB or starting server:", error.message);
        }
    });
}
startServer();
