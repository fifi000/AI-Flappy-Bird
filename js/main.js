// screen setup
const canvas = document.getElementById("game_window");


var smartphoneScreen = window.innerWidth < window.innerHeight;

// PC monitors
if (!smartphoneScreen) {
    canvas.height = 0.9 * window.innerHeight;
    canvas.width = canvas.height * 7 / 8;
}
// smartphones
else {
    canvas.width = 0.9 * window.innerWidth;
    canvas.height = 8 / 7 * canvas.width;
}
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// neat imports
const Neat = neataptic.Neat;
const Node = neataptic.Node;
const Methods = neataptic.methods;
const Architect = neataptic.architect;

// network parameters
const urlParams = new URLSearchParams(window.location.search);
const POPULATION_COUNT = urlParams.get("POPULATION_COUNT") ?? 100;
const MAX_GENERATIONS = urlParams.get("MAX_GENERATIONS") ?? 50;
const ELITISM_PERCENTAGE = urlParams.get("ELITISM_PERCENTAGE") ?? 0.1;
const INPUT_NEURONS = 3;
const OUTPUT_NEURONS = 1;
// const ELITISM_PERCENTAGE = parseFloat(prompt("Enter the elitism percentage (as a decimal):"));
// const MAX_GENERATIONS = parseInt(prompt("Enter the maximum number of generations (e.g. 50):"));
// const POPULATION_COUNT = parseInt(prompt("Enter the population count (e.g. 1000):"));


// network
var neat = new Neat(INPUT_NEURONS, OUTPUT_NEURONS, null, {
    mutation: [
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_WEIGHT,
        // Methods.mutation.ADD_CONN,
        // Methods.mutation.SUB_CONN,
    ],
    popsize: POPULATION_COUNT,
    mutationRate: 0.3,
    elitism: Math.round(POPULATION_COUNT * ELITISM_PERCENTAGE)
});

// give each model random weight and bias values
for (let i = 0; i < neat.population.length; i++) {
    neat.population[i] = getNetwork();
}

// game variables
var pipesCount = 0;
var pipesGap = 5 / 12 * WIDTH;
var floorSpeed;
var players = []
var pipes = [];
var floor;
const gameState = {
    current : 1,
    neutral : 0,
    playing : 1,
    over : 2
}
const background = new ImgObject(WIDTH, HEIGHT * 7 / 8, 0, 0);


window.addEventListener("keydown", (event) => { if (event.code === "Space") jumpEvent() });
window.addEventListener("touchstart", (event) => jumpEvent());


function jumpEvent() {
    if (gameState.current === gameState.neutral) {
        gameState.current = gameState.playing;
    }
    
    if (gameState.current !== gameState.over) {
          players.forEach(player => { player.jump(); });
    }
    else {
        reset();
    }
}


function getNetwork() {
    let input = Array.from({ length: INPUT_NEURONS }, () => new Node());
    let output = Array.from({ length: OUTPUT_NEURONS }, () => new Node());
    let min = -1;
    let max = 1;

    input.forEach(neuron => {
        output.forEach(n => neuron.connect(n));
    })

    let network = Architect.Construct(input.concat(output));

    network.nodes.forEach(neuron => {
        neuron.squash = Methods.activation.TANH;
        neuron.bias = Math.random() * 2 * max + min;
    });

    network.connections.forEach(con => {
        con.weight = Math.random() * 2 * max + min;
    })

    return network;
}


function getPipes(n) {
    let pipes = [ new Pipe(
        1 / 6 * WIDTH,
        HEIGHT - floor.height,
        2 * WIDTH,
        0
    )];
    
    for (let i = 1; i < n; i++) {
        pipes[i] = new Pipe(
            pipes[i-1].width,
            pipes[i-1].height,
            pipes[i-1].endX + pipesGap,
            0
        );
    }

    return pipes;
}


function draw() {
    background.draw();

    pipes.forEach(pipe => { pipe.draw() });
    players.forEach(player => { player.draw() });

    floor.draw();

    // score
    ctx.font = (smartphoneScreen) ? "bold 2.5em Arial" : "bold 4em Consolas";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowColor = "black"
    ctx.shadowBlur = 10;
    ctx.fillText(pipesCount, WIDTH/ 2, HEIGHT * 0.1);
    ctx.shadowColor = null;
    ctx.shadowBlur = null;
    
    const maxScore = Math.max(...players.map(player => player.brain.score));
    drawBrain(players.find(player => player.brain.score === maxScore).brain);    
}


function update() {
    players.forEach(player => { player.update() });
    floor.update();

    pipes.forEach(pipe => { pipe.update() });
    
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].endX < 0) {
            pipes.shift();
            pipes.push(new Pipe(
                pipes[pipes.length - 1].width,
                pipes[pipes.length - 1].height,
                pipes[pipes.length - 1].endX + pipesGap,
                0
            ));
        }
    }
}


function checkCollision() {
    players.forEach(player => {
        if (pipes.some(pipe => pipe.checkCollision(player)) || floor.checkCollision(player) || player.startY <= 0) {
            player.dead = true;
        }
    })

    return players.every(player => player.dead);
}


function reset() {
    pipesCount = 0;
    floorSpeed = 2.5 / 600 * WIDTH;

    // players reset
    players = []
    neat.population.forEach(genome => {
        players.push(
            new Player(
                72 / 600 * WIDTH,
                52 / 800 * HEIGHT,
                228 / 600 * WIDTH,
                HEIGHT / 2,
                genome
            )
        );
    });

    floor = new Floor(
        WIDTH,
        HEIGHT - background.height,
        0
    );

    pipes = getPipes(5);
}


function evaluateNetwork(player) {
    let pipe = pipes.find(p => p.endX >= player.startX);

    let inputs = [
        player.startY / background.height,
        pipe.upper.height / background.height,
        pipe.lower.startY / background.height        
    ];
    
    let output = player.brain.activate(inputs);

    // playing mode when there is only one bird
    if (players.length == 1) {
        return false;
    }
    return output[0] > 0.5;
}


function evolve() {
    neat.sort();
    let newPopulation = [];

    for (let i = 0; i < neat.elitism; i++) {
        newPopulation.push(neat.population[i]);
    }

    // Breed the rest of the population
    for (let i = 0; i < neat.popsize - neat.elitism; i++) {
        newPopulation.push(neat.getOffspring());
    }

    // Replace the old population with the new one
    neat.population = newPopulation;
    neat.mutate();
    neat.generation += 1;

    if (pipesCount < 100 && neat.generation > MAX_GENERATIONS) {
        for (let i = 0; i < neat.population.length; i++) {
            neat.population[i] = getNetwork();
            neat.generation = 0;
        }
    }
}


function gameLoop() {
    requestAnimationFrame(gameLoop)
    if (gameState.current === gameState.playing) {
        players.forEach(player => {
            if (!player.dead && evaluateNetwork(player)) {
                player.jump();
            }
        });

        update();        
        draw();
    }
    else if (gameState.current === gameState.over) {
        draw();
    }

    if (checkCollision()) {
        gameState.current = gameState.playing;
        floorSpeed = 0;
        console.log(`Generation: ${neat.generation}\t\t\tPipe: ${pipesCount}`);

        if (players.length > 1) {
            evolve();
        }
        reset();        
    }
}


function drawBrain(brain) {
    if (!brain) return;
    
    let canvas = document.getElementById('neuralNetworkCanvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodeRadius = 20;
    const nodeVerticalGap = 80;

    const inputPositions = [];
    const outputPositions = [];

    // asing index to nodes
    brain.nodes.forEach((node, index) => node.index = index);

    // Calculate node positions for drawing
    // input nodes
    brain.nodes.filter(node => node.type === 'input').forEach(node => {
        node.x = canvas.width / 4;
        node.y = (node.index + 1) * nodeVerticalGap;
        inputPositions.push(node);
    });
    // output nodex
    brain.nodes.filter(node => node.type === 'output').forEach(node => {
        node.x = canvas.width / 4 * 3;
        node.y = inputPositions[Math.floor(inputPositions.length / 2)].y;
        outputPositions.push(node);
    });

    // Draw connections
    brain.connections.forEach(connection => {
        const fromNode = inputPositions.find(node => node.index === connection.from.index);
        const toNode = outputPositions.find(node => node.index === connection.to.index);

        if (!fromNode || !toNode) return;

        ctx.beginPath();
        ctx.moveTo(fromNode.x + nodeRadius, fromNode.y);
        ctx.lineTo(toNode.x - nodeRadius, toNode.y);
        ctx.lineWidth = Math.abs(connection.weight) * 5;;
        ctx.strokeStyle = connection.weight >= 0 ? '#00ff00' : '#ff0000';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#000000';
    });

    // Draw nodes
    inputPositions.concat(outputPositions).forEach(position => {
        
        ctx.beginPath();
        ctx.arc(position.x, position.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.stroke();
        
        const bias = position.bias.toFixed(2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(bias, position.x, position.y);
    });
}

reset();
gameLoop()
