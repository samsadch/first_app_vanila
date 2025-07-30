import './style.css'

// DOM elements
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const filterButtons = document.querySelectorAll('.filter-btn');
const pixelSizeSlider = document.getElementById('pixel-size');
const pixelSizeValue = document.getElementById('pixel-size-value');
const pixelateControl = document.getElementById('pixelate-control');
const cellSizeSlider = document.getElementById('cell-size');
const cellSizeValue = document.getElementById('cell-size-value');
const halftoneControl = document.getElementById('halftone-control');
let currentFilter = 'normal';
let pixelSize = 10; // Default pixel size
let cellSize = 10; // Default cell size for halftone
let stream = null;
let animationFrameId = null;

// Canvas context
const ctx = canvas.getContext('2d');

// Initialize the app
async function init() {
  try {
    // Request camera access
    stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    
    // Set video source to camera stream
    video.srcObject = stream;
    
    // Wait for video to be ready
    video.onloadedmetadata = () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Start rendering
      startRendering();
    };
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Unable to access camera. Please make sure you have granted camera permissions.');
  }
}

// Render loop
function startRendering() {
  // Cancel any existing animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  function render() {
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply selected filter
    applyFilter(currentFilter);
    
    // Continue rendering
    animationFrameId = requestAnimationFrame(render);
  }
  
  // Start render loop
  render();
}

// Apply filter to canvas
function applyFilter(filter) {
  // Get image data from canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  switch (filter) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
      }
      break;
      
    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      }
      break;
      
    case 'vintage':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = r * 1.1;
        data[i + 1] = g * 0.9;
        data[i + 2] = b * 0.8;
      }
      break;
      
    case 'brightness':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.3);
        data[i + 1] = Math.min(255, data[i + 1] * 1.3);
        data[i + 2] = Math.min(255, data[i + 2] * 1.3);
      }
      break;
      
    case 'contrast':
      const factor = 1.5; // Contrast factor
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, 128 + factor * (data[i] - 128));
        data[i + 1] = Math.min(255, 128 + factor * (data[i + 1] - 128));
        data[i + 2] = Math.min(255, 128 + factor * (data[i + 2] - 128));
      }
      break;
      
    case 'saturation':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        const factor = 1.5; // Saturation factor
        
        data[i] = Math.min(255, gray + factor * (r - gray));
        data[i + 1] = Math.min(255, gray + factor * (g - gray));
        data[i + 2] = Math.min(255, gray + factor * (b - gray));
      }
      break;
      
    case 'blur':
      // Simple blur effect - we'll apply it after putting the image data back
      ctx.putImageData(imageData, 0, 0);
      ctx.filter = 'blur(5px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      return; // Skip the putImageData below since we've already drawn
    
    case 'pixelate':
      // Pixelate effect
      ctx.putImageData(imageData, 0, 0);
      
      // Save current canvas content
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw pixelated version
      const pSize = pixelSize;
      
      // Calculate the number of pixels in each dimension
      const numPixelsX = Math.ceil(canvas.width / pSize);
      const numPixelsY = Math.ceil(canvas.height / pSize);
      
      for (let y = 0; y < numPixelsY; y++) {
        for (let x = 0; x < numPixelsX; x++) {
          // Get the color data from the center of each "pixel"
          const pixelX = Math.min(x * pSize + pSize / 2, canvas.width - 1);
          const pixelY = Math.min(y * pSize + pSize / 2, canvas.height - 1);
          
          // Get pixel color from the temp canvas
          const pixelData = tempCtx.getImageData(pixelX, pixelY, 1, 1).data;
          
          // Draw a rectangle with that color
          ctx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
          ctx.fillRect(x * pSize, y * pSize, pSize, pSize);
        }
      }
      
      return; // Skip the putImageData below since we've already drawn
      
    case 'halftone':
      // Halftone effect
      ctx.putImageData(imageData, 0, 0);
      
      // Save current canvas content
      const htTempCanvas = document.createElement('canvas');
      const htTempCtx = htTempCanvas.getContext('2d');
      htTempCanvas.width = canvas.width;
      htTempCanvas.height = canvas.height;
      htTempCtx.drawImage(canvas, 0, 0);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background to white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw halftone dots using the user-defined cell size
      const maxDotSize = cellSize * 0.9; // Maximum dot size (90% of cell)
      
      // Calculate the number of cells in each dimension
      const numCellsX = Math.ceil(canvas.width / cellSize);
      const numCellsY = Math.ceil(canvas.height / cellSize);
      
      // Set dot color to black
      ctx.fillStyle = 'black';
      
      for (let y = 0; y < numCellsY; y++) {
        for (let x = 0; x < numCellsX; x++) {
          // Get the color data from the center of each cell
          const cellX = Math.min(x * cellSize + cellSize / 2, canvas.width - 1);
          const cellY = Math.min(y * cellSize + cellSize / 2, canvas.height - 1);
          
          // Get pixel color from the temp canvas
          const pixelData = htTempCtx.getImageData(cellX, cellY, 1, 1).data;
          
          // Calculate brightness (0-255)
          // Using luminance formula: 0.299*R + 0.587*G + 0.114*B
          const brightness = 0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2];
          
          // Invert brightness (darker areas get larger dots)
          const invertedBrightness = 255 - brightness;
          
          // Calculate dot size based on brightness (0-maxDotSize)
          const dotSize = (invertedBrightness / 255) * maxDotSize;
          
          // Draw the dot in the center of the cell
          if (dotSize > 0) {
            ctx.beginPath();
            ctx.arc(
              x * cellSize + cellSize / 2, 
              y * cellSize + cellSize / 2, 
              dotSize / 2, 
              0, 
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      }
      
      return; // Skip the putImageData below since we've already drawn
      
    case 'normal':
    default:
      // No filter
      break;
  }
  
  // Put modified image data back to canvas
  ctx.putImageData(imageData, 0, 0);
}

// Event listeners for filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Set current filter
    currentFilter = button.dataset.filter;
    
    // Show/hide filter controls
    // Hide all controls first
    pixelateControl.style.display = 'none';
    halftoneControl.style.display = 'none';
    
    // Show the appropriate control based on the selected filter
    if (currentFilter === 'pixelate') {
      pixelateControl.style.display = 'flex';
    } else if (currentFilter === 'halftone') {
      halftoneControl.style.display = 'flex';
    }
  });
});

// Event listener for pixel size slider
pixelSizeSlider.addEventListener('input', () => {
  pixelSize = parseInt(pixelSizeSlider.value);
  pixelSizeValue.textContent = pixelSize;
});

// Event listener for cell size slider
cellSizeSlider.addEventListener('input', () => {
  cellSize = parseInt(cellSizeSlider.value);
  cellSizeValue.textContent = cellSize;
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
