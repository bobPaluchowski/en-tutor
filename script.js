
// Navigation functionality
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Split slider functionality
const sliderHandle = document.getElementById('slider-handle');
const englishPanel = document.getElementById('english-panel');
const programmingPanel = document.getElementById('programming-panel');
const splitContainer = document.querySelector('.split-container');

let isDragging = false;
let startX = 0;
let currentPosition = 50; // Start at center (50%)

// Mouse events
sliderHandle.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// Touch events for mobile
sliderHandle.addEventListener('touchstart', startDragTouch, { passive: false });
document.addEventListener('touchmove', dragTouch, { passive: false });
document.addEventListener('touchend', stopDrag);

// Keyboard accessibility
sliderHandle.addEventListener('keydown', handleKeyboard);

function startDrag(e) {
  isDragging = true;
  startX = e.clientX;
  sliderHandle.style.cursor = 'grabbing';
}

function startDragTouch(e) {
  e.preventDefault();
  isDragging = true;
  startX = e.touches[0].clientX;
}

function drag(e) {
  if (!isDragging) return;
  
  const containerRect = splitContainer.getBoundingClientRect();
  const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
  
  updateSliderPosition(Math.max(10, Math.min(90, newPosition)));
}

function dragTouch(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const containerRect = splitContainer.getBoundingClientRect();
  const newPosition = ((e.touches[0].clientX - containerRect.left) / containerRect.width) * 100;
  
  updateSliderPosition(Math.max(10, Math.min(90, newPosition)));
}

function stopDrag() {
  isDragging = false;
  sliderHandle.style.cursor = 'grab';
}

function handleKeyboard(e) {
  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      updateSliderPosition(Math.max(10, currentPosition - 5));
      break;
    case 'ArrowRight':
      e.preventDefault();
      updateSliderPosition(Math.min(90, currentPosition + 5));
      break;
  }
}

function updateSliderPosition(position) {
  currentPosition = position;
  
  // Update panel widths
  englishPanel.style.width = `${position}%`;
  programmingPanel.style.width = `${100 - position}%`;
  
  // Update slider handle position
  sliderHandle.style.left = `${position}%`;
}

// Get Started button functionality
document.getElementById('get-started-btn').addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    lessonType: formData.get('lesson-type'),
    message: formData.get('message')
  };
  
  // Simulate form submission
  alert(`Thank you, ${data.name}! Your message has been received. We'll get back to you soon!`);
  e.target.reset();
});

// Conway's Game of Life animation
class GameOfLife {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cellSize = 8;
    this.cols = 0;
    this.rows = 0;
    this.grid = [];
    this.animationId = null;
    
    this.resizeCanvas();
    this.initializeGrid();
    this.addGliderPattern();
    this.animate();
    
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.initializeGrid();
      this.addGliderPattern();
    });
  }
  
  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    this.cols = Math.floor(this.canvas.width / this.cellSize);
    this.rows = Math.floor(this.canvas.height / this.cellSize);
  }
  
  initializeGrid() {
    this.grid = [];
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
      }
    }
  }
  
  addGliderPattern() {
    // Add multiple glider patterns at different positions
    const gliders = [
      { x: 5, y: 5 },
      { x: Math.floor(this.cols * 0.3), y: Math.floor(this.rows * 0.3) },
      { x: Math.floor(this.cols * 0.7), y: Math.floor(this.rows * 0.7) }
    ];
    
    gliders.forEach(pos => {
      if (pos.x + 3 < this.cols && pos.y + 3 < this.rows) {
        // Classic glider pattern
        this.grid[pos.y][pos.x + 1] = 1;
        this.grid[pos.y + 1][pos.x + 2] = 1;
        this.grid[pos.y + 2][pos.x] = 1;
        this.grid[pos.y + 2][pos.x + 1] = 1;
        this.grid[pos.y + 2][pos.x + 2] = 1;
      }
    });
  }
  
  countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const newX = x + j;
        const newY = y + i;
        
        if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows) {
          count += this.grid[newY][newX];
        }
      }
    }
    return count;
  }
  
  nextGeneration() {
    const newGrid = [];
    
    for (let i = 0; i < this.rows; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        const neighbors = this.countNeighbors(j, i);
        
        if (this.grid[i][j] === 1) {
          // Cell is alive
          newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          // Cell is dead
          newGrid[i][j] = (neighbors === 3) ? 1 : 0;
        }
      }
    }
    
    this.grid = newGrid;
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#00ff00';
    
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === 1) {
          this.ctx.fillRect(
            j * this.cellSize,
            i * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
          );
        }
      }
    }
  }
  
  animate() {
    this.draw();
    this.nextGeneration();
    
    // Slow down the animation
    setTimeout(() => {
      this.animationId = requestAnimationFrame(() => this.animate());
    }, 200);
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize Game of Life when page loads
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-of-life');
  if (canvas) {
    new GameOfLife(canvas);
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
  }
});
