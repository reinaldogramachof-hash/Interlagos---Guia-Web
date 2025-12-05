import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/firebaseConfig.js';

async function verifyData() {
    console.log("Conectando ao Firestore...");
    try {
        const querySnapshot = await getDocs(collection(db, "merchants"));
        console.log(`Encontrados ${querySnapshot.size} comerciantes no banco de dados:`);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`- [${doc.id}] ${data.name} (${data.category})`);
        });
    } catch (error) {
        console.error("Erro ao ler do Firestore:", error);
    }
    process.exit(0);
}

verifyData();
