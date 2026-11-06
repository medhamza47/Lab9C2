import React, { useState } from 'react';
import CompteForm from './components/CompteForm';
import CompteList from './components/CompteList';
import './App.css';

function App() {
  const [refreshVersion, setRefreshVersion] = useState(0);

  const refreshComptes = () => {
    setRefreshVersion((version) => version + 1);
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="container app-header-content">
          <a className="brand" href="/" aria-label="Accueil">
            <span className="brand-mark">C</span>
            <span>Comptes</span>
          </a>
          <span className="api-indicator">
            <span className="api-indicator-dot" />
            API REST
          </span>
        </div>
      </header>

      <section className="container app-content">
        <div className="page-intro">
          <p className="eyebrow">GESTION BANCAIRE</p>
          <h1>Vos comptes</h1>
          <p className="page-description">
            Consultez vos comptes ou ajoutez-en un nouveau.
          </p>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-5">
            <CompteForm onCompteAjoute={refreshComptes} />
          </div>
          <div className="col-12 col-lg-7">
            <CompteList refreshVersion={refreshVersion} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
