/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TeamPlayers.css"

function TeamPlayers() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [teamName, setTeamName] = useState("");
  const { team } = useParams();
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
    const sortedPlayers = [...players].sort((a, b) => { //spread - ...
      if (sortConfig.key === null) return 0;
  
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
  
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const fetchPlayers = async (query, isSearch = false) => {
    try {
      const params = { team };
      if (isSearch && query) {
        params.name = query;
      }
      
      const response = await axios.get(`http://localhost:8080/api/player`, { params });
      
      setPlayers(response.data);
      if (response.data.length > 0) {
        setTeamName(response.data[0].squad);
      }
    } catch (error) {
      console.error("Ошибка при загрузке игроков:", error);
    }
  };

  useEffect(() => {
    fetchPlayers("", false); 
  }, [team]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchPlayers(value, true); 
  };

  const handleBackClick = () => {
    navigate(-1); 
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIndicator = (key) => {
      if (sortConfig.key !== key) return '';
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };


  return (
    <div className="page">
      <div className="team-players-header">
        <button onClick={handleBackClick} className="back-button">
          ← Назад
        </button>
        <h2 className="team-title">{teamName || team}</h2>
      </div>
      
      <input
        type="text"
        placeholder="Поиск по имени в команде"
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      
      <table className="players-table">
        <thead>
          <tr>
              <th onClick={() => handleSort('name')} className="sortable">Имя{getSortIndicator('name')}</th>
              <th onClick={() => handleSort('pos')} className="sortable">Позиция{getSortIndicator('pos')}</th>
              <th onClick={() => handleSort('nation')} className="sortable">Нация{getSortIndicator('nation')}</th>
              <th onClick={() => handleSort('age')} className="sortable">Возраст{getSortIndicator('age')}</th>
              <th onClick={() => handleSort('mp')} className="sortable">Матчей сыграно{getSortIndicator('mp')}</th>
              <th onClick={() => handleSort('min')} className="sortable">Минут сыграно{getSortIndicator('min')}</th>
              <th onClick={() => handleSort('starts')} className="sortable">Выходов в старте{getSortIndicator('starts')}</th>
              <th onClick={() => handleSort('compl')} className="sortable">Комплексионное{getSortIndicator('compl')}</th>
              <th onClick={() => handleSort('subs')} className="sortable">Замены{getSortIndicator('subs')}</th>
              <th onClick={() => handleSort('unsub')} className="sortable">В заявке{getSortIndicator('unsub')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.pos}</td>
              <td>{p.nation}</td>
              <td>{p.age}</td>
              <td>{p.mp}</td>
              <td>{p.min}</td>
              <td>{p.starts}</td>
              <td>{p.compl}</td>
              <td>{p.subs}</td>
              <td>{p.unsub}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeamPlayers;