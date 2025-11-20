import { useState, useEffect, useCallback } from 'react'
import * as d3 from 'd3'

/**
 * Hook for cemetery force-directed layout
 * @param {Array} files - Array of file objects
 * @param {Object} dimensions - {width, height}
 */
export function useCemeteryLayout(files, dimensions) {
  const [nodes, setNodes] = useState([])
  const [simulation, setSimulation] = useState(null)

  useEffect(() => {
    if (!files || files.length === 0) return

    // Transform files to nodes
    const layoutNodes = files.map((file) => ({
      id: file.path,
      ...file,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 200,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 200,
      radius: Math.sqrt(file.linesOfCode || 100) / 2 + 20,
    }))

    // Create force simulation
    const sim = d3
      .forceSimulation(layoutNodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force(
        'center',
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force(
        'collision',
        d3.forceCollide().radius((d) => d.radius + 10)
      )
      .force('x', d3.forceX(dimensions.width / 2).strength(0.05))
      .force('y', d3.forceY(dimensions.height / 2).strength(0.05))

    // Update nodes on tick
    sim.on('tick', () => {
      setNodes([...layoutNodes])
    })

    setSimulation(sim)

    return () => {
      sim.stop()
    }
  }, [files, dimensions.width, dimensions.height])

  const updateNodePosition = useCallback(
    (nodeId, x, y) => {
      if (!simulation) return

      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        node.fx = x
        node.fy = y
        simulation.alpha(0.3).restart()
      }
    },
    [simulation, nodes]
  )

  const releaseNode = useCallback(
    (nodeId) => {
      if (!simulation) return

      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        node.fx = null
        node.fy = null
        simulation.alpha(0.3).restart()
      }
    },
    [simulation, nodes]
  )

  return {
    nodes,
    updateNodePosition,
    releaseNode,
  }
}
