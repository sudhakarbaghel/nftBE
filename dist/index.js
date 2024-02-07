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
const contractsRoutes_1 = __importDefault(require("./routes/contractsRoutes"));
const tokensRoutes_1 = __importDefault(require("./routes/tokensRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
const mongoURI = process.env.MONGO_URI;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoURI);
            console.log('Connected to MongoDB database!');
        }
        catch (error) {
            console.error('MongoDB connection error:', error.message);
        }
    });
}
connectToDatabase();
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use(express_1.default.json());
app.use('/contracts', contractsRoutes_1.default);
app.use('/tokens', tokensRoutes_1.default);
app.use('/search', searchRoutes_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
