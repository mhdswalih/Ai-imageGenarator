const inputField = document.querySelector('#input-field');
const submitBtn = document.querySelector('.submit-btn');
const imageContainer = document.querySelector('.image-container');

// Replace with your Pexels API key
const API_KEY = 'Jq4xM6MYuhcjmzdbsmNrOfol4m6M2A2qvqkgfHxF7YJRVWV9C3hQIikq';

const downloadImage = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `generated-image-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Download failed:', error);
    }
};

const createImageCard = (imageUrl, prompt) => {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${prompt}" class="generated-img">
        <div class="image-actions">
            <span class="prompt-text">${prompt}</span>
            <button class="download-btn" onclick="downloadImage('${imageUrl}')">
                <span class="material-icons">download</span>
                Download
            </button>
        </div>
    `;
    
    return card;
};

const getImage = async () => {
    const prompt = inputField.value.trim();
    if (!prompt) {
        alert('Please enter a description');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Generating...';

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}&per_page=1`,
            {
                headers: {
                    'Authorization': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.photos.length === 0) {
            alert('No images found. Try a different description.');
            return;
        }

        const photo = data.photos[0];
        const imageCard = createImageCard(photo.src.large, prompt);
        imageContainer.insertBefore(imageCard, imageContainer.firstChild);
        inputField.value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate image. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-icons">auto_awesome</span> Generate';
    }
};

submitBtn.addEventListener('click', getImage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getImage();
    }
});
