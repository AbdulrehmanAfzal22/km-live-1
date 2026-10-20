// Small, deterministic set of decorative particles. No canvas or third-party scripts.
// These particles mount only when the election card is active and in view.
export const electionConfettiPieces = Object.freeze(
  Array.from({ length: 48 }, (_, id) => {
    const angle = (id * 137.508) % 360
    const x = (id * 37 + 11) % 100
    const y = (id * 13 + 3) % 29 - 12
    const horizontalDrift = Math.round(Math.sin(angle * Math.PI / 180) * (70 + id % 5 * 15))
    return {
      id,
      shape: id % 7 === 0 ? 'ribbon' : id % 3 === 0 ? 'round' : 'paper',
      style: {
        '--confetti-x': `${x}%`,
        '--confetti-y': `${y}%`,
        '--confetti-drift': `${horizontalDrift}px`,
        '--confetti-drop': `${460 + (id * 47) % 280}px`,
        '--confetti-turns': `${540 + (id % 6) * 180}deg`,
        '--confetti-delay': `${(id % 13) * 0.11}s`,
        '--confetti-duration': `${3.1 + (id % 6) * 0.22}s`,
        '--confetti-color': ['#e9be75', '#a95043', '#f6f0db', '#dd9b61', '#d6b5a7', '#dcb34f'][id % 6],
      },
    }
  }),
)
