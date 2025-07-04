📦 quantum-crypto-sim

🔐 Quantum Key Distribution simulator with classical encryption support

quantum-crypto-sim — это TypeScript-библиотека, которая симулирует квантовое распределение ключей (QKD) с использованием протокола BB84 и предоставляет инструменты для шифрования и расшифрования данных на основе полученного квантового ключа.

🛠️ Установка

```bash
npm install quantum-crypto-sim
```

🚀 Пример использования

```ts
import { generateQuantumKey, encrypt, decrypt } from 'quantum-crypto-sim';

// Генерация квантового ключа (с возможной симуляцией атаки)
const key = generateQuantumKey({ length: 128, simulateEve: true });

// Шифруем сообщение
const ciphertext = encrypt('Привет, мир!', key);

// Расшифровываем сообщение
const plaintext = decrypt(ciphertext, key);

console.log(plaintext); // ➜ Привет, мир!
```

Библиотека идеально подходит для:
• образовательных целей,  
• демонстрации квантовых принципов в действии,  
• имитации систем защищённой связи будущего.

✨ Возможности  
🧠 Симуляция протокола BB84 (Alice, Bob и Eve)  
🔍 Проверка на вмешательство (атака перехвата)  
🧬 Генерация симметричного ключа с использованием квантовой логики  
🔐 Шифрование и расшифровка данных на основе полученного ключа (XOR)  
📦 Расширяемая архитектура — можно подключать другие QKD-протоколы и шифры (например, AES)

📘 Поддерживаемые протоколы  
✅ BB84 (Bennett & Brassard, 1984) — реализация в первой версии  
🟡 B92 (в планах)  
🟡 E91 (в планах)
