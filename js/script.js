const mazeWidth = 10;
const mazeHeight = 10;
let points = 0; // Contador de puntos
const maze = document.getElementById('maze');

// Función para generar el laberinto
function generateMaze() {
    maze.innerHTML = ''; // Limpiar el laberinto
    const grid = Array.from({ length: mazeHeight }, () =>
        Array.from({ length: mazeWidth }, () => ({
            visited: false,
            walls: [true, true, true, true] // Top, Right, Bottom, Left
        }))
    );

    function generateMazeCell(x, y) {
        grid[y][x].visited = true;
        const directions = [
            [x, y - 1, 0, -1],
            [x + 1, y, 1, 0],
            [x, y + 1, 0, 1],
            [x - 1, y, -1, 0]
        ];

        directions.sort(() => Math.random() - 0.5);

        for (const [newX, newY, dx, dy] of directions) {
            if (newX >= 0 && newY >= 0 && newX < mazeWidth && newY < mazeHeight && !grid[newY][newX].visited) {
                grid[y][x].walls[dx + 1 + (dy + 1) * 2] = false;
                grid[newY][newX].walls[-dx + 1 + (-dy + 1) * 2] = false;
                generateMazeCell(newX, newY);
            }
        }
    }

    generateMazeCell(0, 0);

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'wall';
            const left = x * 40;
            const top = y * 40;

            if (cell.walls[0]) {
                const topWall = document.createElement('div');
                topWall.className = 'wall';
                topWall.style.top = `${top}px`;
                topWall.style.left = `${left}px`;
                topWall.style.width = '40px';
                topWall.style.height = '2px';
                maze.appendChild(topWall);
            }

            if (cell.walls[1]) {
                const rightWall = document.createElement('div');
                rightWall.className = 'wall';
                rightWall.style.top = `${top}px`;
                rightWall.style.left = `${left + 38}px`;
                rightWall.style.width = '2px';
                rightWall.style.height = '40px';
                maze.appendChild(rightWall);
            }

            if (cell.walls[2]) {
                const bottomWall = document.createElement('div');
                bottomWall.className = 'wall';
                bottomWall.style.top = `${top + 38}px`;
                bottomWall.style.left = `${left}px`;
                bottomWall.style.width = '40px';
                bottomWall.style.height = '2px';
                maze.appendChild(bottomWall);
            }

            if (cell.walls[3]) {
                const leftWall = document.createElement('div');
                leftWall.className = 'wall';
                leftWall.style.top = `${top}px`;
                leftWall.style.left = `${left}px`;
                leftWall.style.width = '2px';
                leftWall.style.height = '40px';
                maze.appendChild(leftWall);
            }
        });
    });
}

// Función para generar puntos de salida y el jugador
function generateExitAndPlayer() {
    // Generar el punto de inicio en una posición aleatoria
    const startX = Math.floor(Math.random() * mazeWidth);
    const startY = Math.floor(Math.random() * mazeHeight);
    const startElement = document.createElement('div');
    startElement.className = 'exit';
    startElement.style.left = `${startX * 40}px`;
    startElement.style.top = `${startY * 40}px`;
    maze.appendChild(startElement);

    // Generar 3 puntos de salida adicionales en posiciones aleatorias sin superponerse
    for (let i = 0; i < 3; i++) {
        let exitX, exitY;
        do {
            exitX = Math.floor(Math.random() * mazeWidth);
            exitY = Math.floor(Math.random() * mazeHeight);
        } while ((exitX === startX && exitY === startY) || maze.querySelectorAll('.exit').length >= 4);

        const exitElement = document.createElement('div');
        exitElement.className = 'exit';
        exitElement.style.left = `${exitX * 40}px`;
        exitElement.style.top = `${exitY * 40}px`;
        maze.appendChild(exitElement);
    }

    // Añadir al jugador al laberinto
    const player = document.createElement('div');
    player.id = 'player';
    player.style.left = '0px';
    player.style.top = '0px';
    maze.appendChild(player);
}

// Generar el laberinto y los elementos al inicio
generateMaze();
generateExitAndPlayer();

// Event listener para mover al jugador con las teclas
document.addEventListener('keydown', function(event) {
    const player = document.getElementById('player');
    const step = 40; // Tamaño de cada paso

    // Obtener la posición actual del jugador
    let playerTop = parseInt(player.style.top);
    let playerLeft = parseInt(player.style.left);

    // Mover al jugador dependiendo de la tecla presionada
    switch(event.key) {
        case 'ArrowUp':
            playerTop = Math.max(playerTop - step, 0);
            break;
        case 'ArrowDown':
            playerTop = Math.min(playerTop + step, (mazeHeight - 1) * 40);
            break;
        case 'ArrowLeft':
            playerLeft = Math.max(playerLeft - step, 0);
            break;
        case 'ArrowRight':
            playerLeft = Math.min(playerLeft + step, (mazeWidth - 1) * 40);
            break;
    }

    // Verificar si el jugador alcanzó un punto de salida
    const cellX = playerLeft / 40;
    const cellY = playerTop / 40;
    const exits = document.querySelectorAll('.exit');
    exits.forEach(exit => {
        const exitX = parseInt(exit.style.left) / 40;
        const exitY = parseInt(exit.style.top) / 40;
        if (cellX === exitX && cellY === exitY) {
            maze.removeChild(exit); // Eliminar el punto de salida
            points++; // Incrementar el contador de puntos
        }
    });

    // Verificar si se han recogido todos los puntos
    if (points >= 4) {
        points = 0; // Reiniciar el contador de puntos
        generateMaze(); // Generar otro laberinto
        generateExitAndPlayer(); // Generar puntos de salida y el jugador
    }

    // Actualizar la posición del jugador
    player.style.left = `${playerLeft}px`;
    player.style.top = `${playerTop}px`;
});