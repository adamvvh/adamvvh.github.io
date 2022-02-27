import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKanB06SWnI_Nxetu5pK80Ada7iFSWCoo",
  authDomain: "adamvvhgithubio.firebaseapp.com",
  projectId: "adamvvhgithubio",
  storageBucket: "adamvvhgithubio.appspot.com",
  messagingSenderId: "12851510064",
  appId: "1:12851510064:web:9b79f9f6e9934df282a6f5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const buttonEL = document.getElementById("birthdayButton");
buttonEL.addEventListener('click', (evt) => submit(evt));

const errorEl = document.getElementById("error");
const successEL = document.getElementById("success");

function showError(message) {
  errorEl.innerText = message;
}

function hideError() {
  errorEl.innerText = "";
}

function showSuccess(message) {
  successEL.innerText = message;
}

function hideSuccess() {
  successEL.innerText = "";
}

async function submit(evt) {
  evt.preventDefault();
  hideError();
  hideSuccess();
  const email = document.getElementById("email").value;
  if (!email) {
    showError("Please enter email.");
  } else {
    const slots = {};
    let slotEl;
    ["slot1", "slot2", "slot3"].forEach(slotId => {
      slotEl = document.getElementById(slotId);
      slots[slotEl.value] = slotEl.checked;
    })
    console.log(slots);

    try {
      const docRef = await addDoc(collection(db, "birthdaySlots"), {
        email,
        slots
      });
      // console.log("Document written with ID: ", docRef.id);
      showSuccess("Thank you!");
    } catch (e) {
      showError("Error adding document");
      console.error("Error adding document: ", e);
    }
  }

}
