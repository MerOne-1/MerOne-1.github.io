// JavaScript for interactive elements can be added here.
console.log('Welcome to Merwan Mezrag\'s personal website!');

class CryptoSnake {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.coin = this.generateCoin();
        this.score = 0;
        this.cryptoCount = 0;
        this.gameLoop = null;
        this.difficultySettings = {
            easy: { initialSpeed: 200, speedIncrease: 2, scoreMultiplier: 1 },
            medium: { initialSpeed: 150, speedIncrease: 3, scoreMultiplier: 2 },
            hard: { initialSpeed: 100, speedIncrease: 4, scoreMultiplier: 3 },
            expert: { initialSpeed: 80, speedIncrease: 5, scoreMultiplier: 4 }
        };
        this.gameSpeed = this.difficultySettings.easy.initialSpeed;
        this.currentDifficulty = 'easy';

        // Bind event listeners
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
        });
    }

    generateCoin() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#f7931a';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw coin
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(
            this.coin.x * this.gridSize + this.gridSize/2,
            this.coin.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw ₿ symbol on coin
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            '₿',
            this.coin.x * this.gridSize + this.gridSize/2,
            this.coin.y * this.gridSize + this.gridSize/2
        );
    }

    move() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check if snake ate the coin
        if (head.x === this.coin.x && head.y === this.coin.y) {
            const difficulty = this.difficultySettings[this.currentDifficulty];
            this.score += 10 * difficulty.scoreMultiplier;
            this.cryptoCount++;
            document.getElementById('score').textContent = this.score;
            document.getElementById('cryptoCount').textContent = this.cryptoCount;
            this.coin = this.generateCoin();
            
            // Increase speed based on difficulty
            const minSpeed = 50;
            if (this.gameSpeed > minSpeed) {
                this.gameSpeed -= difficulty.speedIncrease;
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
            }
        } else {
            this.snake.pop();
        }
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // Self collision
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    handleKeyPress(e) {
        // Prevent scrolling when using arrow keys
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        const newDirection = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        }[e.key];

        if (newDirection) {
            // Prevent 180-degree turns
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };
            
            if (opposites[newDirection] !== this.direction) {
                this.direction = newDirection;
            }
        }
    }

    gameStep() {
        this.move();
        this.draw();
    }

    startGame() {
        // Reset game state
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.score = 0;
        this.cryptoCount = 0;
        this.gameSpeed = this.difficultySettings[this.currentDifficulty].initialSpeed;
        document.getElementById('score').textContent = '0';
        document.getElementById('cryptoCount').textContent = '0';
        
        // Clear previous game loop if exists
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        // Start new game loop
        this.gameLoop = setInterval(() => this.gameStep(), this.gameSpeed);
        document.getElementById('startGame').blur();
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#f7931a';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new CryptoSnake();
});
