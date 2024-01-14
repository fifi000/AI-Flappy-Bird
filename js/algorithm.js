// TODO
const PYTHON_DATA = [];


// neat imports
const Neat = neataptic.Neat;
const Node = neataptic.Node;
const Methods = neataptic.methods;
const Architect = neataptic.architect;
const Network = neataptic.Network;

// network parameters
const urlParams = new URLSearchParams(window.location.search);

const TARGET_SCORE = urlParams.get("TARGET_SCORE") ?? 100;
const POPULATION_COUNT = urlParams.get("POPULATION_COUNT") ?? 100;
const MAX_GENERATIONS = urlParams.get("MAX_GENERATIONS") ?? 50;
const ELITISM_PERCENTAGE = urlParams.get("ELITISM_PERCENTAGE") ?? 0.1;
const MUTATION_RATE = urlParams.get("MUTATION_RATE") ?? 0.3;

const INPUT_NEURONS = 3;
const OUTPUT_NEURONS = 1;
// const ELITISM_PERCENTAGE = parseFloat(prompt("Enter the elitism percentage (as a decimal):"));
// const MAX_GENERATIONS = parseInt(prompt("Enter the maximum number of generations (e.g. 50):"));
// const POPULATION_COUNT = parseInt(prompt("Enter the population count (e.g. 1000):"));


// network
const neat = new Neat(INPUT_NEURONS, OUTPUT_NEURONS, null, {
    mutation: [
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_WEIGHT,
        // Methods.mutation.ADD_CONN,
        // Methods.mutation.SUB_CONN,
    ],
    popsize: POPULATION_COUNT,
    mutationRate: MUTATION_RATE,
    elitism: Math.round(POPULATION_COUNT * ELITISM_PERCENTAGE)
});


// give each model random weight and bias values
for (let i = 0; i < neat.population.length; i++) {
    neat.population[i] = getNetwork();
}

function getRandomValue(min = -1, max = 1) {
    return Math.random() * 2 * max + min;
}

function getNetwork() {
    let input = Array.from({ length: INPUT_NEURONS }, () => new Node());
    let output = Array.from({ length: OUTPUT_NEURONS }, () => new Node());

    input.forEach(neuron => {
        output.forEach(n => neuron.connect(n));
    })

    let network = Architect.Construct(input.concat(output));

    network.nodes.forEach(neuron => {
        if (neuron.type !== "input") {
            neuron.squash = Methods.activation.LOGISTIC;
            neuron.bias = getRandomValue();
        }
    });

    network.connections.forEach(con => {
        con.weight = getRandomValue();
    })

    return network;
}

function normalize(value, minValue, maxValue, targetMin, targetMax) {
    let normalizedValue = (value - minValue) / (maxValue - minValue);
    return normalizedValue * (targetMax - targetMin) + targetMin;
}

function evaluateNetwork(player, players, pipes) {
    // playing mode when there is only one bird
    if (players.length == 1) return false;

    // get the closest pipe
    let pipe = pipes.find(p => p.endX >= player.startX);

    // Normalize inputs to the range of -5 to 5
    let normalizedStartY = normalize(player.startY, 0, background.height, -5, 5);
    let normalizedUpperHeight = normalize(pipe.upper.height, 0, background.height, -5, 5);
    let normalizedLowerStartY = normalize(pipe.lower.startY, 0, background.height, -5, 5);

    let inputs = [
        normalizedStartY,
        normalizedUpperHeight,
        normalizedLowerStartY
    ];

    let output = player.brain.activate(inputs);

    return output[0] > 0.5;
}

function mutate(genome) {
    let mutation = neat.mutation[Math.floor(Math.random() * neat.mutation.length)];

    switch (mutation) {
        case Methods.mutation.MOD_BIAS:
            genome.nodes.forEach(node => {
                node.bias = getRandomValue();
            })
            break;
        case Methods.mutation.MOD_WEIGHT:
            genome.connections.forEach(con => {
                con.weight = getRandomValue();
            })
            break;
        default:
            break;
    }
}

function evolve() {
    // check if the target score is reached
    if (pipesCount < TARGET_SCORE && neat.generation >= MAX_GENERATIONS) {
        neat.population = Array.from({ length: POPULATION_COUNT }, () => getNetwork());
        neat.generation = 0;
        return
    }

    // TODO
    PYTHON_DATA.push({
        generation: neat.generation,
        scores: players.map(player => player.brain.score),
        pipes: players.map(player => player.pipes)
    });

    if (pipesCount >= TARGET_SCORE) {
        console.log("Target score reached!");
    }

    neat.sort();
    let newPopulation = [];

    // Elite population
    for (let i = 0; i < neat.elitism; i++) {
        newPopulation.push(neat.population[i]);
    }

    // Breed the rest of the population
    for (let i = 0; i < neat.popsize - neat.elitism; i++) {
        let newGenome = neat.getOffspring();
        if (Math.random() <= neat.mutationRate) {
            mutate(newGenome);
        }
        newPopulation.push(newGenome);
    }

    // Replace the old population with the new one
    neat.population = newPopulation;
    neat.generation += 1;
}