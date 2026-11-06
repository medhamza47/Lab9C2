import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import API_BASE_URL from '../config';

function CompteList({ refreshVersion }) {
  const [comptes, setComptes] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const loadComptes = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/comptes`);
        if (!Array.isArray(response.data)) {
          throw new Error("La réponse de l'API n'est pas une liste de comptes.");
        }
        if (isCurrent) {
          setComptes(response.data);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              'Impossible de charger les comptes.'
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    loadComptes();
    return () => {
      isCurrent = false;
    };
  }, [refreshVersion]);

  return (
    <section className="card app-card list-card">
      <div className="card-body">
        <div className="section-heading list-heading">
          <div>
            <h2 className="card-title">Liste des comptes</h2>
            <p className="section-description">
              Les données sont chargées depuis l’API.
            </p>
          </div>
          {!isLoading && !error && (
            <span className="count-badge">
              {comptes.length} {comptes.length > 1 ? 'comptes' : 'compte'}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="loading-state" role="status">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            <span>Chargement des comptes…</span>
          </div>
        ) : error ? (
          <div className="alert alert-warning mb-0" role="alert">
            <strong>Connexion à l’API impossible.</strong>
            <span className="d-block mt-1">{error}</span>
            <span className="d-block mt-2 small">
              Vérifiez que le backend est lancé sur {API_BASE_URL}.
            </span>
          </div>
        ) : comptes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              ◌
            </span>
            <p className="mb-1">Aucun compte pour le moment</p>
            <span>Ajoutez un compte avec le formulaire.</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle account-table">
              <thead>
                <tr>
                  <th scope="col">Compte</th>
                  <th scope="col">Date de création</th>
                  <th scope="col">Type</th>
                  <th className="text-end" scope="col">
                    Solde
                  </th>
                </tr>
              </thead>
              <tbody>
                {comptes.map((compte) => (
                  <tr key={compte.id}>
                    <td>
                      <span className="account-id">#{compte.id}</span>
                    </td>
                    <td>{formatDate(compte.dateCreation)}</td>
                    <td>
                      <span
                        className={`type-badge ${
                          compte.type === 'EPARGNE' ? 'type-savings' : 'type-current'
                        }`}
                      >
                        {compte.type === 'EPARGNE' ? 'Épargne' : 'Courant'}
                      </span>
                    </td>
                    <td className="text-end account-balance">
                      {formatBalance(compte.solde)} MAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatBalance(value) {
  const balance = Number(value);
  return Number.isFinite(balance)
    ? new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(balance)
    : String(value ?? '—');
}

CompteList.propTypes = {
  refreshVersion: PropTypes.number.isRequired,
};

export default CompteList;
