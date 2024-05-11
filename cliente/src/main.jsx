
import ReactDOM from 'react-dom/client';
import Rutas from './routes/Routes.jsx';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Rutas />
  </BrowserRouter>
);
