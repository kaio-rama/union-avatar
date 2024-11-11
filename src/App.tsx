import './App.css'
import { AssetProvider } from './components/AssetContext'
// import Avatars from './components/Avatars'
import Navbar from './components/Navbar'
import Scene from './components/Scene'
import UI from './components/UI'

function App() {
  return (
    <AssetProvider>
        <Navbar />
        <div className='interface-container'>
          <Scene />
          <UI />
      </div>
    </AssetProvider>
  )
}

export default App

