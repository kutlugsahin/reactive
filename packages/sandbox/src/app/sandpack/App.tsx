import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { sandpackRoutes } from './sandpack-routes';

const Routing = () => {
  const navigate = useNavigate();

  const listen = (ev: MessageEvent) => {
    if (ev.data.type === 'urlchange') {
      navigate(ev.data.url);
    }
  };

  useEffect(() => {
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, []);

  return null;
};

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route key="home" path="/" element={<Navigate replace to={'/hello-world'} />} />
        {sandpackRoutes.map((route) => {
          return <Route key={route.route} path={route.route} Component={route.component} />;
        })}
      </Routes>
      <Routing />
    </BrowserRouter>
  );
};
