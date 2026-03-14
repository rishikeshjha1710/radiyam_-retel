import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Order } from "@/types";

const PRODUCTS = "products";
const ORDERS = "orders";
const USERS = "users";

function getProductsCol() {
  if (!db) return null;
  return collection(db, PRODUCTS);
}

function getOrdersCol() {
  if (!db) return null;
  return collection(db, ORDERS);
}

function getUsersCol() {
  if (!db) return null;
  return collection(db, USERS);
}

export async function getProductsList(): Promise<Product[]> {
  const col = getProductsCol();
  if (!col) return [];
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) return null;
  const ref = doc(db, PRODUCTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function createProduct(data: Omit<Product, "id">): Promise<string> {
  const col = getProductsCol();
  if (!col) throw new Error("Firestore not available");
  const ref = await addDoc(col, {
    ...data,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  if (!db) throw new Error("Firestore not available");
  const ref = doc(db, PRODUCTS, id);
  await updateDoc(ref, data as DocumentData);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not available");
  const ref = doc(db, PRODUCTS, id);
  await deleteDoc(ref);
}

export async function getOrdersList(): Promise<Order[]> {
  const col = getOrdersCol();
  if (!col) return [];
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const o = d.data();
    return {
      id: d.id,
      ...o,
      createdAt: o.createdAt instanceof Timestamp ? o.createdAt.toMillis() : o.createdAt,
              date: o.date || (o.createdAt instanceof Timestamp
                ? new Date(o.createdAt.toMillis()).toISOString().slice(0, 10)
                : ""),
    } as Order;
  });
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!db) return null;
  const ref = doc(db, ORDERS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const o = snap.data();
  return {
    id: snap.id,
    ...o,
    createdAt: o?.createdAt instanceof Timestamp ? o.createdAt.toMillis() : o?.createdAt,
    date: o?.date || (o?.createdAt instanceof Timestamp
      ? new Date(o.createdAt.toMillis()).toISOString().slice(0, 10)
      : ""),
  } as Order;
}

export async function createOrder(data: Omit<Order, "id" | "orderId" | "createdAt" | "date">): Promise<{ id: string; orderId: string }> {
  const col = getOrdersCol();
  if (!col) throw new Error("Firestore not available");
  const now = Date.now();
  const orderId = "INV-" + now.toString(36).toUpperCase().slice(-8);
  const ref = await addDoc(col, {
    ...data,
    orderId,
    createdAt: now,
    date: new Date(now).toISOString().slice(0, 10),
  });
  return { id: ref.id, orderId };
}

// User Collection Functions
export async function setUserProfile(uid: string, data: any) {
  if (!db) return;
  const ref = doc(db, USERS, uid);
  await updateDoc(ref, data).catch(async (err) => {
    // If document doesn't exist, create it (add/set)
    const { setDoc } = await import("firebase/firestore");
    await setDoc(ref, { 
      ...data, 
      id: uid,
      createdAt: Date.now() 
    });
  });
}

export async function getUserProfile(uid: string) {
  if (!db) return null;
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getUsersList(): Promise<any[]> {
  const col = getUsersCol();
  if (!col) return [];
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
