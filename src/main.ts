import { EncryptionRequest, EncryptionResponse } from './types';
const apiUrl = import.meta.env.VITE_API_URL;

// SZYFROWANIE
const form = document.getElementById('encryption-form') as HTMLFormElement;
const plainTextInput = document.getElementById('plainText') as HTMLInputElement;
const algorithmInput = document.getElementById('algorithm') as HTMLSelectElement;
const keyInput = document.getElementById('key') as HTMLInputElement;
const keyContainer = document.getElementById('key-container')!;
const resultDiv = document.getElementById('result')!;
const errorDiv = document.getElementById('error')!;

// DESZYFROWANIE
const decryptionForm = document.getElementById('decryption-form') as HTMLFormElement;
const decryptionText = document.getElementById('decryptionText') as HTMLInputElement;
const decryptionAlgorithm = document.getElementById('decryptionAlgorithm') as HTMLSelectElement;
const decryptionKey = document.getElementById('decryptionKey') as HTMLInputElement;
const decryptionKeyContainer = document.getElementById('decryption-key-container')!;
const decryptionResult = document.getElementById('decryption-result')!;
const decryptionError = document.getElementById('decryption-error')!;

const generateRsaButton = document.getElementById('generate-rsa-button')!;
const rsaResult = document.getElementById('rsa-result')!;
const rsaError = document.getElementById('rsa-error')!;

const stegForm = document.getElementById('steganography-form') as HTMLFormElement;
const stegImageInput = document.getElementById('steg-image') as HTMLInputElement;
const stegMessageInput = document.getElementById('steg-message') as HTMLInputElement;
const stegError = document.getElementById('steg-error')!;
const stegSuccess = document.getElementById('steg-success')!;

const stegExtractForm = document.getElementById('steg-extract-form') as HTMLFormElement;
const stegExtractImageInput = document.getElementById('steg-extract-image') as HTMLInputElement;
const stegExtractResult = document.getElementById('steg-extract-result')!;
const stegExtractError = document.getElementById('steg-extract-error')!;

const imageInImageForm = document.getElementById('image-in-image-form') as HTMLFormElement;
const hostImageInput = document.getElementById('host-image') as HTMLInputElement;
const hiddenImageInput = document.getElementById('hidden-image') as HTMLInputElement;
const imageInImageError = document.getElementById('image-in-image-error')!;
const imageInImageSuccess = document.getElementById('image-in-image-success')!;

const extractImageForm = document.getElementById('extract-image-form') as HTMLFormElement;
const extractImageInput = document.getElementById('extract-image') as HTMLInputElement;
const extractImageError = document.getElementById('extract-image-error')!;
const extractImageSuccess = document.getElementById('extract-image-success')!;
console.log("api url", apiUrl)

algorithmInput.addEventListener('change', () => {
  const shouldHide = algorithmInput.value === 'sha256';
  keyContainer.classList.toggle('hidden', shouldHide);
  keyInput.toggleAttribute('required', !shouldHide);
});

decryptionAlgorithm.addEventListener('change', () => {
  const shouldHide = decryptionAlgorithm.value === 'sha256';
  decryptionKeyContainer.classList.toggle('hidden', shouldHide);
  decryptionKey.toggleAttribute('required', !shouldHide);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');

  const request: EncryptionRequest = {
    plainText: plainTextInput.value.trim(),
    algorithm: algorithmInput.value.trim(),
    key: keyInput.value.trim(),
  };

  try {
    const response = await fetch(`${apiUrl}/Encryption/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok){
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Błąd podczas przesyłania';
        throw new Error('Błąd podczas przesyłania: ' + errorMessage);
    } 

    const data = (await response.json()) as EncryptionResponse;

    resultDiv.classList.remove('hidden');
    resultDiv.style.whiteSpace = 'pre-line';
    typeWriterEffect(`Zaszyfrowany tekst: ${data.cipherText}, \n Czas: ${data.metrics.elapsedMilliseconds}ms, \n Ram: ${data.metrics.memoryUsedBytes}`, resultDiv);
  } catch (error) {
    errorDiv.textContent = (error as Error).message;
    errorDiv.classList.remove('hidden');
  }
});

decryptionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  decryptionResult.classList.add('hidden');
  decryptionError.classList.add('hidden');

  const request: EncryptionRequest = {
    plainText: decryptionText.value.trim(),
    algorithm: decryptionAlgorithm.value.trim(),
    key: decryptionKey.value.trim(),
  };

  try {
    const response = await fetch(`${apiUrl}/Encryption/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok){
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Błąd podczas przesyłania';
        throw new Error('Błąd podczas przesyłania: ' + errorMessage);
    } 

    const data = (await response.json()) as EncryptionResponse;

    decryptionResult.innerHTML = '';
    decryptionResult.style.whiteSpace = 'pre-line';
    decryptionResult.classList.remove('hidden');
    typeWriterEffect(`Odszyfrowana wiadomość: ${data.cipherText}, \n Czas: ${data.metrics.elapsedMilliseconds}ms, Ram: ${data.metrics.memoryUsedBytes}`, decryptionResult);
  } catch (error) {
    decryptionError.textContent = (error as Error).message;
    decryptionError.classList.remove('hidden');
  }
});

generateRsaButton.addEventListener('click', async () => {
  rsaResult.classList.add('hidden');
  rsaError.classList.add('hidden');
  rsaResult.innerHTML = '';

  try {
    const response = await fetch(`${apiUrl}/Encryption/generate-rsa-keys`, {
      method: 'GET',
    });

    if (!response.ok){
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Błąd podczas przesyłania';
        throw new Error('Błąd podczas przesyłania: ' + errorMessage);
    } 
    const data = await response.json() as {
      publicKeyXml: string;
      privateKeyXml: string;
    };

    rsaResult.innerHTML = `
      <div id="rsa-public" class="rsa-key-block"></div>
      <button id="toggle-private-key">Pokaż klucz prywatny</button>
      <div id="rsa-private" class="rsa-key-block hidden"></div>
    `;
    rsaResult.classList.remove('hidden');

    const rsaPublicDiv = document.getElementById('rsa-public')!;
    const rsaPrivateDiv = document.getElementById('rsa-private')!;
    const togglePrivateButton = document.getElementById('toggle-private-key') as HTMLButtonElement;

    typeWriterEffect(` Publiczny klucz RSA:\n${data.publicKeyXml}`, rsaPublicDiv, 10);
    rsaPrivateDiv.textContent = ` Prywatny klucz RSA:\n${data.privateKeyXml}`;

    togglePrivateButton.addEventListener('click', () => {
      const isHidden = rsaPrivateDiv.classList.contains('hidden');
      rsaPrivateDiv.classList.toggle('hidden');
      togglePrivateButton.textContent = isHidden ? 'Ukryj klucz prywatny' : 'Pokaż klucz prywatny';
    });
  } catch (error) {
    rsaError.textContent = (error as Error).message;
    rsaError.classList.remove('hidden');
  }
});


stegForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  stegError.classList.add('hidden');
  stegSuccess.classList.add('hidden');

  const file = stegImageInput.files?.[0];
  const message = stegMessageInput.value.trim();

  if (!file || !message) {
    stegError.textContent = 'Wymagany jest plik i wiadomość.';
    stegError.classList.remove('hidden');
    return;
  }

  const formData = new FormData();
  formData.append('Image', file);
  formData.append('Message', message);

  try {
    const response = await fetch(`${apiUrl}/steganography/embed`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Błąd podczas przesyłania';
        throw new Error('Błąd podczas przesyłania: ' + errorMessage);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'steganography.png';
    a.click();
    const timeHeader = response.headers.get('Czas'); 
    const ramHeader = response.headers.get('Ram');
    console.log(timeHeader, ramHeader); //  sdasd
    stegSuccess.style.whiteSpace = 'pre-line';
    stegSuccess.classList.remove('hidden');
    typeWriterEffect(`Czas: ${timeHeader}ms, Ram: ${ramHeader}`, stegSuccess);

  } catch (error) {
    stegError.textContent = (error as Error).message;
    stegError.classList.remove('hidden');
  }
});

stegExtractForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  stegExtractResult.classList.add('hidden');
  stegExtractError.classList.add('hidden');
  stegExtractResult.innerHTML = '';

  const file = stegExtractImageInput.files?.[0];
  if (!file) {
    stegExtractError.textContent = 'Wymagany jest plik PNG.';
    stegExtractError.classList.remove('hidden');
    return;
  }

  const formData = new FormData();
  formData.append('Image', file);

  try {
    const response = await fetch(`${apiUrl}/steganography/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Błąd podczas przesyłania';
        throw new Error('Błąd podczas przesyłania: ' + errorMessage);
    }
    const data = (await response.json()) as EncryptionResponse;

    stegExtractResult.style.whiteSpace = 'pre-line';
    stegExtractResult.classList.remove('hidden');
    typeWriterEffect(`Ukryta wiadomość:\n${data.cipherText},\n Czas: ${data.metrics.elapsedMilliseconds} ms,\nRam: ${data.metrics.memoryUsedBytes}`, stegExtractResult, 15);
  } catch (error) {
    stegExtractError.textContent = (error as Error).message;
    stegExtractError.classList.remove('hidden');
  }
});

  imageInImageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  imageInImageError.classList.add('hidden');
  imageInImageSuccess.classList.add('hidden');

  const hostFile = hostImageInput.files?.[0];
  const hiddenFile = hiddenImageInput.files?.[0];

  if (!hostFile || !hiddenFile) {
    imageInImageError.textContent = 'Oba obrazy są wymagane.';
    imageInImageError.classList.remove('hidden');
    return;
  }

  const formData = new FormData();
  formData.append('HostImage', hostFile);
  formData.append('HiddenImage', hiddenFile);

  try {
    const response = await fetch(`${apiUrl}/steganography/embed-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Błąd podczas przesyłania';
        throw new Error('Błąd podczas przesyłania: ' + errorMessage);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'hidden-image.png';
    a.click();
    const timeHeader = response.headers.get('Czas'); 
    const ramHeader = response.headers.get('Ram');

    console.log(timeHeader, ramHeader);
    imageInImageSuccess.style.whiteSpace = 'pre-line';
    imageInImageSuccess.classList.remove('hidden');
    typeWriterEffect(`Czas: ${timeHeader}ms, Ram: ${ramHeader}`, imageInImageSuccess);
    
  } catch (error) {
    imageInImageError.textContent = (error as Error).message;
    imageInImageError.classList.remove('hidden');
  }
});

extractImageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  extractImageError.classList.add('hidden');
  extractImageSuccess.classList.add('hidden');

  const imageFile = extractImageInput.files?.[0];
  if (!imageFile) {
    extractImageError.textContent = 'Wymagany jest obraz.';
    extractImageError.classList.remove('hidden');
    return;
  }
  const formData = new FormData();
  formData.append('Image', imageFile);
  try {
    const response = await fetch(`${apiUrl}/steganography/extract-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Błąd podczas odczytu obrazu: ' + response.statusText);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted.png';
    a.click();
    const timeHeader = response.headers.get('Czas'); 
    const ramHeader = response.headers.get('Ram');

    console.log(timeHeader, ramHeader);
    extractImageSuccess.style.whiteSpace = 'pre-line';
    extractImageSuccess.classList.remove('hidden');
    typeWriterEffect(`Czas: ${timeHeader}ms, Ram: ${ramHeader}`, extractImageSuccess);

  } catch (error) {
    extractImageError.textContent = (error as Error).message;
    extractImageError.classList.remove('hidden');
  }
});


function typeWriterEffect(text: string, container: HTMLElement, speed = 20) {
  let index = 0;
  const cursor = document.createElement('span');
  cursor.className = 'blinking-cursor';
  cursor.textContent = '_';

  const buffer = document.createElement('span');
  container.innerHTML = '';
  container.appendChild(buffer);
  container.appendChild(cursor);

  const type = () => {
    if (index < text.length) {
      buffer.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      cursor.remove();
    }
  };

  type();
}
