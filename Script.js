const API_KEY = 'KnMugWHqXM3TnDSsqgAVs9nz';
const API_URL = 'https://api.remove.bg/v1.0/removebg';


// DOM elements
const back_error_2 = document.querySelector('#error_sms_2');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const removeBgBtn = document.getElementById('removeBgBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const previewImage = document.getElementById('previewImage');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const uploadArea = document.getElementById('uploadArea');
const resultArea = document.getElementById('resultArea');
const loading = document.getElementById('loading');

let uploadedFile = null;

// Event listeners
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
removeBgBtn.addEventListener('click', removeBackground);
downloadBtn.addEventListener('click', downloadResult);
resetBtn.addEventListener('click', resetAll);

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drop-zone--over');
}

// Handle drag leave
function handleDragLeave() {
    dropZone.classList.remove('drop-zone--over');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
}

// Process the uploaded file
function processFile(file) {
    uploadedFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        originalImage.src = e.target.result;
        dropZone.querySelector('.drop-zone__prompt').style.display = 'none';
        removeBgBtn.style.display = 'block';
        resetBtn.style.display = 'block';
        
    };
    reader.readAsDataURL(file);
}

// Remove background using API
async function removeBackground() {
    if (!uploadedFile) return;
    
    // Show loading
    loading.style.display = 'flex';
    
    try {
        const formData = new FormData();
        formData.append('image_file', uploadedFile);
        formData.append('size', 'auto');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const blob = await response.blob();
        const resultUrl = URL.createObjectURL(blob);
        resultImage.src = resultUrl;
        
        // Show result area
        uploadArea.style.display = 'none';
        resultArea.style.display = 'block';
        downloadBtn.style.display = 'inline-Block';
        
    } catch (error) {
        back_error_2.style.display = "inline-block";
        back_error_2.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Error removing background:
        ${error}`;
        // alert("Failed to remove background. Please try again.");
        if(!resultImage.src && !resultImage.src !== error)
            {   
             speak('Failed To Remove Background');
            }
            
       
    } finally {
        loading.style.display = 'none';
        if(resultImage.src ) 
        {
            speak('Image Background Removed');
        }
        
    }
}

let originalFile = null; // This should be set when the user uploads the file

// Download the result
function downloadResult() {
    if (!resultImage.src) {
        alert('No image to download!');
        return;
    }
    
    // Get the original filename without extension
    let originalName = 'processed'; // default name
    if (originalFile) {
        originalName = originalFile.name.replace(/\.[^/.]+$/, "");
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = `BT_Dark_Images_${originalName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Example of how to set originalFile when user uploads an image
document.getElementById('fileInput').addEventListener('change', function(e) {
    originalFile = e.target.files[0];
    // ... rest of your upload handling code
});

// Reset everything
function resetAll() {
    //Reset Onself
    resetBtn.style.display = "none";
    //Reset Error SMS
    back_error_2.style.display = "none";
    back_error_2.innerHTML = "..................";
    // Reset file input
    fileInput.value = '';
    
    // Reset preview
    previewImage.src = '';
    previewImage.style.display = 'none';
    dropZone.querySelector('.drop-zone__prompt').style.display = 'block';
    
    // Reset result
    resultImage.src = '';
    originalImage.src = '';
    
    // Reset buttons
    removeBgBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
    
    // Show upload area
    uploadArea.style.display = 'block';
    resultArea.style.display = 'none';
    
    uploadedFile = null;
}

//Non Related
function speak(text) {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Optional: Configure voice settings
        utterance.rate = 1.0; // Speed (0.1 to 10)
        utterance.pitch = 1.0; // Pitch (0 to 2)
        utterance.volume = 1.0; // Volume (0 to 1)
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser doesn't support text-to-speech.");
    }
}