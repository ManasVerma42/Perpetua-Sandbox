import heapq

def dijkstra(graph, start):
    # Initialize distances with infinity and set the distance to the start node to 0
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0

    # Priority queue to keep track of nodes to explore
    queue = [(0, start)]

    while queue:
        current_distance, current_node = heapq.heappop(queue)

        # If the popped node distance is greater than the recorded distance, skip it
        if current_distance > distances[current_node]:
            continue

        # Explore neighbors
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight

            # If a shorter path to the neighbor is found
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(queue, (distance, neighbor))

    return distances

# Example usage
if __name__ == "__main__":
    graph = {
        'A': {'B': 1, 'C': 4},
        'B': {'A': 1, 'C': 2, 'D': 5},
        'C': {'A': 4, 'B': 2, 'D': 1},
        'D': {'B': 5, 'C': 1}
    }
    print(dijkstra(graph, 'A'))