import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import API_BASE_URL from '../config';

const initialCompte = {
  solde: '',
  dateCreation: '',
  type: 'COURANT',
};

function CompteForm({ onCompteAjoute }) {
  const [compte, setCompte] = useState(initialCompte);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCompte((currentCompte) => ({ ...currentCompte, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/comptes`, {
        ...compte,
        solde: Number(compte.solde),
      });
      setCompte(initialCompte);
      onCompteAjoute();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "L'ajout du compte a échoué."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card app-card form-card">
      <div className="card-body">
        <div className="section-heading">
          <span className="section-icon" aria-hidden="true">
            +
          </span>
          <div>
            <h2 className="card-title">Ajouter un compte</h2>
            <p className="section-description">
              Renseignez les informations du nouveau compte.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="solde">
              Solde
            </label>
            <div className="input-group">
              <input
                className="form-control"
                id="solde"
                name="solde"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={compte.solde}
                onChange={handleChange}
                required
              />
              <span className="input-group-text">MAD</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="dateCreation">
              Date de création
            </label>
            <input
              className="form-control"
              id="dateCreation"
              name="dateCreation"
              type="date"
              value={compte.dateCreation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="type">
              Type de compte
            </label>
            <select
              className="form-select"
              id="type"
              name="type"
              value={compte.type}
              onChange={handleChange}
              required
            >
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Épargne</option>
            </select>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary w-100 submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ajout en cours…' : 'Ajouter le compte'}
          </button>
        </form>
      </div>
    </section>
  );
}

CompteForm.propTypes = {
  onCompteAjoute: PropTypes.func.isRequired,
};

export default CompteForm;
