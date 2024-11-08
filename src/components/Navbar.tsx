interface Props {
    style: React.CSSProperties;
}

export default function Navbar(props : Props) {
  return (
    <div style={props.style}>
        <h1 style={{margin:0, padding: 10}}> Avatar Generator Test </h1>
    </div>
  )
}