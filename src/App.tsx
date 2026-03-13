import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Home } from './pages/Home';
import { Room1 } from './pages/Room1';
import { Room2 } from './pages/Room2';
import { Room3 } from './pages/Room3';
import { Room4 } from './pages/Room4';
import { Room5 } from './pages/Room5';
import { Room6 } from './pages/Room6';
import { Room7 } from './pages/Room7';
import { Room8 } from './pages/Room8';
import { Room9 } from './pages/Room9';
import { Room10 } from './pages/Room10';
import { MasterKey } from './pages/MasterKey';
import { Portal } from './pages/Portal';
import './App.css';

// Room router component to handle dynamic room routing
const RoomRouter = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id || '0', 10);

  switch (roomId) {
    case 1:
      return <Room1 />;
    case 2:
      return <Room2 />;
    case 3:
      return <Room3 />;
    case 4:
      return <Room4 />;
    case 5:
      return <Room5 />;
    case 6:
      return <Room6 />;
    case 7:
      return <Room7 />;
    case 8:
      return <Room8 />;
    case 9:
      return <Room9 />;
    case 10:
      return <Room10 />;
    default:
      return <div>Puzzle Room {roomId} - Coming Soon</div>;
  }
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<RoomRouter />} />
          <Route path="/master-key" element={<MasterKey />} />
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
