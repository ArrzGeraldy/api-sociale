import { signInWithEmailAndPassword } from 'firebase/auth'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import 'dotenv/config'
import { auth } from '../config/firebase.config'

interface FileData {
  type: string
  buffer: Buffer
}

export const deleteImage = async (imageName: string) => {
  const storage = getStorage()

  await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER!, process.env.FIREBASE_AUTH!)
  const deserRef = ref(storage, imageName)
  return await deleteObject(deserRef)
}

export async function uploadImage(file: FileData, quantity: string) {
  const storageFB = getStorage()

  await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER!, process.env.FIREBASE_AUTH!)

  if (quantity === 'single') {
    const dateTime = Date.now()
    const fileName = `images/${dateTime}`
    const storageRef = ref(storageFB, fileName)
    const metadata = {
      contentType: file.type
    }
    const snapShot = await uploadBytesResumable(storageRef, file.buffer, metadata)
    const url = await getDownloadURL(snapShot.ref)
    // await uploadBytesResumable(storageRef, file.buffer, metadata);
    const imageData = {
      url,
      fileName
    }
    return imageData
  }

  // if (quantity === "multiple") {
  //   for (let i = 0; i < file.images.length; i++) {
  //     const dateTime = Date.now();
  //     const fileName = `images/${dateTime}`;
  //     const storageRef = ref(storageFB, fileName);
  //     const metadata = {
  //       contentType: file.images[i].mimetype,
  //     };

  //     const saveImage = await Image.create({ imageUrl: fileName });
  //     file.item.imageId.push({ _id: saveImage._id });
  //     await file.item.save();

  //     await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);
  //   }
  //   return;
  // }
}
