import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

type Post = {
  id: string;
  title: string;
  content: string;
}

async function top(n: number): Promise<Post[]> {
  const posts = collection(db, "posts")
  const q = query(posts, limit(n))
  const snapshot = await getDocs(q)


  return snapshot.docs.map(doc => {
    const data = doc.data()

    const title = data.title || "Untitled"
    const description = data.content || "No description"

    return {
      id: doc.id,
      title: title,
      content: description
    }
  })
}

async function list(): Promise<Post[]> {
  const querySnapshot = await getDocs(collection(db, "posts"));
  return querySnapshot.docs.map(doc => {
    const id = doc.id
    const docData = doc.data()
    const data = {
      id: id,
      title: docData.title,
      content: docData.content,
    }
    return data
  })

}

async function get(slug: string): Promise<Post | null> {
  const docRef = collection(db, "posts")
  const q = query(docRef)
  const snapshot = await getDocs(q)
  const postDoc = snapshot.docs.find(doc => doc.id === slug)

  if (!postDoc) {
    return null
  }
  
  const data = postDoc.data()

  return {
    id: postDoc.id,
    title: data.title || "Untitled",
    content: data.content || "No content"
  }
}

export const posts = {
  list,
  top,
  get
}