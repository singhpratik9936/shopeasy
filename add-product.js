import { db } from "./firebase-config.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function addProduct() {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      name: "Casual T-Shirt",
      price: 499,
      category: "Fashion"
    });

    console.log("Product added:", docRef.id);

  } catch (error) {
    console.error("Error adding product:", error);
  }
}