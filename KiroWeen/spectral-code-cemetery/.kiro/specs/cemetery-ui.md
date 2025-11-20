# Cemetery UI Specification

## Purpose

The Cemetery UI provides an immersive, Halloween-themed visualization of Git repository analysis, where files are represented as tombstones in a spooky graveyard.

## Visual Components

### Cemetery Layout
- Dark, foggy background
- Scattered tombstones (files)
- Ghostly animations
- Moonlight effects
- Floating particles (fog, leaves)
- Eerie sound effects (optional)

### Tombstone Component
- File name engraved
- Epitaph on hover
- Size based on file importance
- Color based on activity level
- Cracks/decay based on age
- Glow effect for recent changes

### Ghost Visualization
- Floating ghosts represent contributors
- Ghost size = contribution amount
- Ghost opacity = activity level
- Animated movement patterns
- Hover shows contributor details

### Timeline Scrubber
- Horizontal timeline at bottom
- Scrub through repository history
- Tombstones appear/disappear based on time
- Animated transitions
- Date markers

## Interactions

### Tombstone Interactions
- Click: Show detailed file history
- Hover: Display epitaph and stats
- Double-click: View file content
- Right-click: Context menu (compare, blame)

### Ghost Interactions
- Click: Show contributor profile
- Hover: Display contribution stats
- Follow: Track ghost's commits

### Cemetery Navigation
- Pan: Drag to move around
- Zoom: Scroll to zoom in/out
- Search: Find specific files
- Filter: Show/hide by criteria

## Animations

### Entry Animations
- Tombstones rise from ground
- Ghosts fade in
- Fog rolls in
- Moon rises

### Idle Animations
- Ghosts float randomly
- Fog drifts
- Tombstones sway slightly
- Occasional lightning flash

### Interaction Animations
- Tombstone glow on hover
- Ghost approach on click
- Smooth transitions
- Particle effects

## Color Scheme

- Background: Deep purple/black gradient
- Tombstones: Gray with purple highlights
- Active files: Green glow
- Inactive files: Dark gray
- Ghosts: Translucent white/blue
- Accents: Orange, purple, green

## Responsive Design

- Desktop: Full cemetery view
- Tablet: Simplified layout
- Mobile: List view with cards
- Touch gestures supported
