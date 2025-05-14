const apiKey = 'sk-bxCpLWZ4jShbvHRxvWIvO6rIBW6sYVGcoXUN0Jq6skxuyFI3'; // Get from https://platform.stability.ai/
const endpoint = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

const generateBtn = document.getElementById('generate-btn');
const inputField = document.getElementById('input-field');
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');

async function generateImage(prompt) {
    try {
        loading.style.display = 'block';
        generateBtn.disabled = true;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [{
                    text: prompt,
                    weight: 1
                }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error: ${error.message}`);
        }

        const result = await response.json();
        
        if (result.artifacts && result.artifacts.length > 0) {
            const image = result.artifacts[0];
            
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            // Convert base64 to image URL
            const imageUrl = `data:image/png;base64,${image.base64}`;
            
            imageCard.innerHTML = `
                <img src="${imageUrl}" alt="${prompt}" class="generated-img"/>
                <div class="image-info">
                    <p>${prompt}</p>
                    <button class="download-btn" onclick="downloadImage('${imageUrl}')">
                        <span class="material-icons">download</span>
                    </button>
                </div>
            `;

            gallery.insertBefore(imageCard, gallery.firstChild);
            inputField.value = '';
        } else {
            throw new Error('No image generated');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate image. Please try again.');
    } finally {
        loading.style.display = 'none';
        generateBtn.disabled = false;
    }
}

// Update download function to handle URLs
function downloadImage(imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

generateBtn.addEventListener('click', () => {
    const prompt = inputField.value.trim();
    if (prompt) {
        generateImage(prompt);
    } else {
        alert('Please enter a description');
    }
});

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const prompt = inputField.value.trim();
        if (prompt) {
            generateImage(prompt);
        } else {
            alert('Please enter a description');
        }
    }
});
