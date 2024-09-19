const API_KEY = "";
const inputField = document.querySelector('#input-field');
const submitIcon = document.querySelector('.submitIcon');
const imageSection = document.querySelector('.Image-section');

const getImage = async () => {
    try {
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "prompt": inputField.value.trim(),
                "n": 4,
                "size": "1024x1024"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        imageSection.innerHTML = '';

        data.data.forEach((imageData, index) => {
            if (index < 4) {
                const imgElement = document.createElement('img');
                imgElement.src = imageData.url;
                imgElement.alt = 'Generated Image';
                imgElement.classList.add('generated-img');
                imageSection.appendChild(imgElement);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

submitIcon.addEventListener('click', getImage);
