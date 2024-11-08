import './App.css'
import { AssetProvider } from './components/AssetContext'
// import Avatars from './components/Avatars'
import Navbar from './components/Navbar'
import Scene from './components/Scene'
import UI from './components/UI'

function App() {
  return (
    <AssetProvider>
        <Navbar style={{backgroundColor: '#111', color: 'white', position: 'fixed', top: 0, left: 0, width: '100%'}} />
        <div className='interface-container'>
          <Scene />
          <UI />
      </div>
    </AssetProvider>
  )
}

export default App
