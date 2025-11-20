# Component Patterns

## Container/Presentational Pattern

### Container Components
Handle logic, data fetching, and state management.

```javascript
// CemeteryContainer.jsx
function CemeteryContainer() {
  const { data, isLoading } = useGitAnalysis()
  
  if (isLoading) return <LoadingGhost />
  
  return <Cemetery data={data} />
}
```

### Presentational Components
Focus on rendering UI, receive data via props.

```javascript
// Cemetery.jsx
function Cemetery({ data }) {
  return (
    <div className="cemetery">
      {data.files.map(file => (
        <Tombstone key={file.path} file={file} />
      ))}
    </div>
  )
}
```

## Compound Components

For complex components with multiple parts.

```javascript
// Tombstone compound component
function Tombstone({ children }) {
  return <div className="tombstone">{children}</div>
}

Tombstone.Header = function TombstoneHeader({ name }) {
  return <h3>{name}</h3>
}

Tombstone.Epitaph = function TombstoneEpitaph({ text }) {
  return <p className="epitaph">{text}</p>
}

// Usage
<Tombstone>
  <Tombstone.Header name="index.js" />
  <Tombstone.Epitaph text="Here lies..." />
</Tombstone>
```

## Render Props

For sharing logic between components.

```javascript
function SpookyAnimation({ children }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return children({
    isHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  })
}

// Usage
<SpookyAnimation>
  {({ isHovered, ...handlers }) => (
    <div {...handlers}>
      {isHovered && <Ghost />}
    </div>
  )}
</SpookyAnimation>
```

## Custom Hooks Pattern

Extract reusable logic into hooks.

```javascript
// useSpookyHover.js
function useSpookyHover() {
  const [isHovered, setIsHovered] = useState(false)
  
  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }
  
  return [isHovered, handlers]
}

// Usage
function Tombstone() {
  const [isHovered, hoverHandlers] = useSpookyHover()
  
  return (
    <div {...hoverHandlers}>
      {isHovered && <Epitaph />}
    </div>
  )
}
```

## Higher-Order Components (HOC)

Wrap components to add functionality.

```javascript
// withSpookyAnimation.jsx
function withSpookyAnimation(Component) {
  return function SpookyComponent(props) {
    const controls = useAnimation()
    
    return (
      <motion.div animate={controls}>
        <Component {...props} />
      </motion.div>
    )
  }
}

// Usage
const AnimatedTombstone = withSpookyAnimation(Tombstone)
```

## Context Pattern

Share data without prop drilling.

```javascript
// CemeteryContext.jsx
const CemeteryContext = createContext()

export function CemeteryProvider({ children }) {
  const [selectedTombstone, setSelectedTombstone] = useState(null)
  
  return (
    <CemeteryContext.Provider value={{ selectedTombstone, setSelectedTombstone }}>
      {children}
    </CemeteryContext.Provider>
  )
}

export function useCemetery() {
  return useContext(CemeteryContext)
}
```

## Error Boundary Pattern

Catch and handle errors gracefully.

```javascript
class SpookyErrorBoundary extends React.Component {
  state = { hasError: false }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  render() {
    if (this.state.hasError) {
      return <GhostlyError message="Something spooky happened!" />
    }
    
    return this.props.children
  }
}
```

## Loading States Pattern

Handle async operations consistently.

```javascript
function DataComponent() {
  const { data, isLoading, error } = useQuery()
  
  if (isLoading) return <LoadingGhost />
  if (error) return <ErrorTombstone error={error} />
  if (!data) return <EmptyCemetery />
  
  return <Cemetery data={data} />
}
```

## Composition Pattern

Build complex UIs from simple components.

```javascript
function CemeteryScene() {
  return (
    <Scene>
      <Background />
      <Moon />
      <Fog />
      <Cemetery>
        <Tombstones />
        <Ghosts />
      </Cemetery>
      <Particles />
    </Scene>
  )
}
```
