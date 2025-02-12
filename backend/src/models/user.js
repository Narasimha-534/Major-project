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
exports.createUserInfo = exports.findUserByEmail = exports.createUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role, department } = user;
    const query = 'INSERT INTO users (username, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [username, email, password, role, department];
    const result = yield database_1.default.query(query, values);
    return result.rows[0];
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = yield database_1.default.query(query, values);
    return result.rows[0] || null;
});
exports.findUserByEmail = findUserByEmail;
const createUserInfo = (userId, role, info) => __awaiter(void 0, void 0, void 0, function* () {
    let query = '';
    let values = [];
    switch (role) {
        case 'student':
            query = 'INSERT INTO student_info (user_id, student_id, year_of_study) VALUES ($1, $2, $3)';
            values = [userId, info.studentId, info.yearOfStudy];
            break;
        case 'faculty':
            query = 'INSERT INTO faculty_info (user_id, faculty_id, position) VALUES ($1, $2, $3)';
            values = [userId, info.facultyId, info.position];
            break;
        case 'admin':
            query = 'INSERT INTO admin_info (user_id, admin_id, access_level) VALUES ($1, $2, $3)';
            values = [userId, info.adminId, info.accessLevel];
            break;
        default:
            throw new Error('Invalid role');
    }
    yield database_1.default.query(query, values);
});
exports.createUserInfo = createUserInfo;
