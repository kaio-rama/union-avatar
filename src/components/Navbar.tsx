export default function Navbar() {
  return (
    <div style={style}>
      <h1 style={{ margin: 0, padding: 10 }}>Avatar Generator Test _ Ramiro Canevari</h1>
    </div>
  );
}

const style: React.CSSProperties = {
  background: 'linear-gradient(to left, #2C193599, #393263AC)',
  textShadow: '#0CD 0px 0 3px', 
  color: '#A5A',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '10vh',
  width: '100%',
};