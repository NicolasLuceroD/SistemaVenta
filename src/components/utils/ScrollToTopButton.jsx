export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Componente del botón reutilizable
const ScrollToTopButton = () => {
  return (
   <button
  onClick={scrollToTop}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#18970dff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  }}
>
  <span style={{ transform: 'translateY(-2px)' }}>↑</span>
</button>

  );
};

export default ScrollToTopButton;
