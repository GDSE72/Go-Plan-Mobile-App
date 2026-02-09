"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.db = exports.auth = exports.firebaseConfig = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const functions_1 = require("firebase/functions");
exports.firebaseConfig = {
    apiKey: "AIzaSyAkYoTV7T54RUsp99WcRXmac3ZkiBcsIoU",
    authDomain: "goplan-4880a.firebaseapp.com",
    projectId: "goplan-4880a",
    storageBucket: "goplan-4880a.firebasestorage.app",
    messagingSenderId: "796014374644",
    appId: "1:796014374644:web:f13b2229c0206151dd38a1"
};
const app = (0, app_1.initializeApp)(exports.firebaseConfig);
// Initialize Auth (Persistence handled automatically by default in newer SDKs or fallback to memory if needed)
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.functions = (0, functions_1.getFunctions)(app);
