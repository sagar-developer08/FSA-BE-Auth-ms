// Helper function to create a key of the correct length
function getKey(key) {
    // Convert the key to a simple integer shift value
    let shift = 0;
    for (let i = 0; i < key.length; i++) {
        shift += key.charCodeAt(i);
    }
    return shift % 26; // Ensure the shift is within the alphabet range
}

// Encryption Function
function encrypt(text, key) {
    const shift = getKey(key);
    let encrypted = '';

    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);

        if (char >= 65 && char <= 90) { // Uppercase letters
            char = ((char - 65 + shift) % 26) + 65;
        } else if (char >= 97 && char <= 122) { // Lowercase letters
            char = ((char - 97 + shift) % 26) + 97;
        }

        encrypted += String.fromCharCode(char);
    }

    return encrypted;
}

// Decryption Function
function decrypt(text, key) {
    const shift = getKey(key);
    let decrypted = '';

    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);

        if (char >= 65 && char <= 90) { // Uppercase letters
            char = ((char - 65 - shift + 26) % 26) + 65;
        } else if (char >= 97 && char <= 122) { // Lowercase letters
            char = ((char - 97 - shift + 26) % 26) + 97;
        }

        decrypted += String.fromCharCode(char);
    }

    return decrypted;
}

module.exports = { encrypt, decrypt };
