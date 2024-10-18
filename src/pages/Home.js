// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0; /* Fundo claro */
  min-height: 100vh; /* Garantir que a página ocupe a altura total */
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const PokemonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza os cards */
`;

const PokemonCard = styled(Link)`
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  text-align: center;
  width: 250px; /* Largura fixa para os cards */
  height: 230px;
  background-color: #fff; /* Fundo branco para os cards */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Sombra */
  transition: transform 0.2s; /* Transição suave para o hover */
  text-decoration: none; /* Remove a sublinha do link */
  color: inherit; /* Herda a cor do texto */

  &:hover {
    transform: scale(1.05); /* Efeito de zoom no hover */
    background: #f1f1f1;
  }
`;

const PokemonImage = styled.img`
  width: 140px; /* Diminuir a largura da imagem */
  height: 125px; /* Manter a proporção da imagem */
`;

const LoadMoreButton = styled.button`
  margin: 20px auto;
  display: block; /* Centraliza o botão */
  padding: 10px 20px;
  background-color: #007bff; /* Cor do botão */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s; /* Transição suave para a cor do botão */

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
        return {
          name: pokemon.name,
          id: id,
          image: detailsData.sprites.other['official-artwork'].front_default // Obtenha a imagem aqui
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
          <PokemonCard key={pokemon.name} to={`/pokemon/${pokemon.name}`}>
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
