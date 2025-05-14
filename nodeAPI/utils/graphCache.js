const redisClient = require("./redisClient");
const Ingredient = require("../models/Ingredient");

const GRAPH_CACHE_KEY = "ingredient_graph_cache";

// Build graph from DB
async function buildGraphFromDB() {
  const ingredients = await Ingredient.findAll({ raw: true });
  const graph = {};

  for (const { item_to_create_id, ingredient_item_id } of ingredients) {
    if (!graph[item_to_create_id]) graph[item_to_create_id] = [];
    graph[item_to_create_id].push(ingredient_item_id);
  }

  return graph;
}

// Save graph to Redis
async function saveGraphToCache(graph) {
  await redisClient.set(GRAPH_CACHE_KEY, JSON.stringify(graph));
}

// Load graph from Redis
async function loadGraphFromCache() {
  const cached = await redisClient.get(GRAPH_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}

// Public method to get graph, build & cache if needed
async function getGraph() {
  let graph = await loadGraphFromCache();

  if (!graph) {
    graph = await buildGraphFromDB();
    await saveGraphToCache(graph);
  }
  return graph;
}

// Clear cache (e.g., after mutation)
async function invalidateGraphCache() {
  await redisClient.del(GRAPH_CACHE_KEY);
}

module.exports = {
  getGraph,
  invalidateGraphCache,
};
