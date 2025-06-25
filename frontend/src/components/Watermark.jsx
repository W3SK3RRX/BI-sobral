const Watermark = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-30deg)',
        fontSize: '4rem',
        color: 'rgba(255, 255, 255, 0.05)',
        zIndex: 9999,
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      Laboratório Sobral
    </div>
  )
}

export default Watermark
