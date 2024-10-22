// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#F0B6BC',
};

const Container = styled.div`
  padding: 20px;
  background-color: black;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: white;
`;

const PokemonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza os cards */
`;

const PokemonCard = styled(Link)`
  border: none;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  text-align: center;
  width: 250px; /* Largura fixa para os cards */
  height: 230px;
  background-color: ${(props) => typeColors[props.type] || '#fff'}; /* Cor com base no tipo */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Sombra */
  transition: transform 0.2s; /* Transição suave para o hover */
  text-decoration: none; /* Remove a sublinha do link */
  color: white; /* Herda a cor do texto */

  &:hover {
    transform: scale(1.05); /* Efeito de zoom no hover */
    background: ${(props) => typeColors[props.type] || '#f1f1f1'}; /* Cor mais clara no hover */
  }
`;

const PokemonImage = styled.img`
  width: 140px; /* Diminuir a largura da imagem */
  height: 125px; /* Manter a proporção da imagem */
`;

const LoadMoreButton = styled.button`
  margin: 20px auto;
  display: block;
  padding: 10px 20px;
  background-color: red;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s; 

  &:hover {
    background-color: #0056b3; /* Cor mais escura no hover */
  }
`;

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchPokemons();
  }, [offset]); // Busca os pokémons sempre que o offset mudar

  const fetchPokemons = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon, index) => {
        const id = index + 1 + offset;
        const detailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const detailsData = await detailsResponse.json();
        const pokemonType = detailsData.types[0].type.name; // Obtenha o tipo do Pokémon
        return {
          name: pokemon.name,
          id: id,
          image: detailsData.sprites.other['official-artwork'].front_default, // Obtenha a imagem aqui
          type: pokemonType // Salva o tipo
        };
      })
    );

    setPokemons((prev) => [...prev, ...pokemonDetails]);
  };

  const loadMore = () => {
    setOffset(offset + 10);
  };

  return (
    <Container>
      <Title>Pokémon List</Title>
      <PokemonList>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.name} to={`/pokemon/${pokemon.name}`} type={pokemon.type}>
            <PokemonImage src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
            <p>#{pokemon.id}</p> {/* Exibe o número do Pokémon */}
          </PokemonCard>
        ))}
      </PokemonList>
      <LoadMoreButton onClick={loadMore}>Carregar mais</LoadMoreButton>
    </Container>
  );
};

export default Home;
