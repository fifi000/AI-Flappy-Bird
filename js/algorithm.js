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
const neat = new Neat(INPUT_NEURONS, OUTPUT_NEURONS, null, {
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
        if (neuron.type !== "input") {
            neuron.squash = Methods.activation.LOGISTIC;
            neuron.bias = Math.random() * 2 * max + min;
        }
    });

    network.connections.forEach(con => {
        con.weight = Math.random() * 2 * max + min;
    })

    return network;
}

function normalize(value, minValue, maxValue, targetMin, targetMax) {
    let normalizedValue = (value - minValue) / (maxValue - minValue);
    return normalizedValue * (targetMax - targetMin) + targetMin;
}

function evaluateNetwork(player) {
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
    let min = -1;
    let max = 1;

    let mutation = neat.mutation[Math.floor(Math.random() * neat.mutation.length)];

    switch (mutation) {
        case Methods.mutation.MOD_BIAS:
            genome.nodes.forEach(node => {
                node.bias = Math.random() * 2 * max + min;
            })
            break;
        case Methods.mutation.MOD_WEIGHT:
            genome.connections.forEach(con => {
                con.weight = Math.random() * 2 * max + min;
            })
            break;
        default:
            break;
    }
}

function evolve() {
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

    if (pipesCount < 100 && neat.generation > MAX_GENERATIONS) {
        for (let i = 0; i < neat.population.length; i++) {
            neat.population[i] = getNetwork();
            neat.generation = 0;
        }
    }
}