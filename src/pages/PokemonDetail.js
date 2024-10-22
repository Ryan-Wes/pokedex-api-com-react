// src/pages/PokemonDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Adiciona o useNavigate
import styled from 'styled-components';

// Define as cores para os tipos de Pokémon
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
  // Adicione mais tipos conforme necessário
};

const BackButton = styled.button`
  display: flex;
  align-itens: center;
  justify-content: center;
  background-color: red;
  border: none;
  color: white;
  padding: 20px 10px;
  font-size: 16px;
  border-radius: 100px;
  cursor: pointer;
  transition: 0.2s ease;
  margin-top: 15px;
  margin-left: 15px;


  &:hover {
    background-color: black;
  }
`;

const Container = styled.div`
  padding: 20px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  background-color: #fff; /* Fundo branco */
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Sombra suave */
  max-width: 800px; /* Aumentar a largura */
  margin: 20px auto; /* Centralizar */
  display: flex; /* Usar flexbox */
  flex-direction: column; /* Colunas */
`;

const Header = styled.div`
  display: flex; /* Usar flexbox para alinhar a imagem e o texto */
  align-items: center; /* Centraliza verticalmente */
  justify-content: space-around;
  margin-bottom: 20px; /* Espaço abaixo do cabeçalho */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px; /* Espaçamento ao redor do botão */
  z-index: 10;
`;


const Image = styled.img`
  width: 250px; /* Aumentar a imagem */
  height: 250px;
  border-radius: 15px; /* Arredondar as bordas */
  margin-right: 20px; /* Espaço entre a imagem e o texto */
`;

const TextContainer = styled.div`
  text-align: center; /* Alinhar o texto ao centro */
`;

const Name = styled.h1`
  margin: 0; /* Remover margens */
  font-size: 2em; /* Tamanho da fonte */
`;

const Type = styled.span`
  display: inline-flex; /* Para que o fundo se ajuste ao conteúdo */
  justify-content: center;
  aligth-itens: center;
  padding: 5px 10px; /* Espaçamento interno */
  border-radius: 20px; /* Bordas arredondadas */
  color: #fff; /* Cor do texto */
  margin: 5px 10px; /* Margens */
  background-color: ${(props) => typeColors[props.type] || '#ccc'}; /* Cor do fundo */
`;

const Section = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc; /* Borda para as seções */
  border-radius: 8px;
  background-color: #f9f9f9; /* Fundo das seções */
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left; /* Alinhar o texto à esquerda */
`;

const ListItem = styled.li`
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #ddd; /* Borda nas habilidades/movimentos */
  border-radius: 5px;
  background-color: #fff; /* Fundo branco */
`;

const MoveContainer = styled.div`
  display: flex; /* Usar flexbox para alinhar os movimentos */
  flex-wrap: wrap; /* Permitir quebra de linha */
  justify-content: center; /* Centralizar os itens */
  margin-top: 10px; /* Espaço acima dos movimentos */
`;

const MoveItem = styled.div`
  background-color: ${(props) => typeColors[props.type] || '#e0e0e0'}; /* Cor de fundo dos movimentos */
  border-radius: 15px; /* Bordas arredondadas */
  padding: 10px; /* Espaçamento interno */
  margin: 5px; /* Margem entre os movimentos */
  flex: 1 0 130px; /* Flexível, mínimo 150px de largura */
  text-align: center; /* Alinhar o texto ao centro */
  color: #fff; /* Cor do texto */
`;


const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [abilitiesDescriptions, setAbilitiesDescriptions] = useState([]);
  const [moves, setMoves] = useState([]);
  const navigate = useNavigate(); // Inicializa o useNavigate

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        setPokemon(data);

        // Buscar descrições das habilidades
        const abilitiesPromises = data.abilities.map(async (ability) => {
          const abilityResponse = await fetch(ability.ability.url);
          const abilityData = await abilityResponse.json();

          // Aqui pegamos a descrição em inglês
          const effect = abilityData.effect_entries.find(entry => entry.language.name === 'en')?.effect;

          return { name: ability.ability.name, effect }; // Pega o nome e a descrição
        });

        const abilitiesDescriptions = await Promise.all(abilitiesPromises);
        setAbilitiesDescriptions(abilitiesDescriptions);

        // Buscar os tipos de movimentos
        const movesPromises = data.moves.slice(0, 5).map(async (moveInfo) => {
          const moveResponse = await fetch(moveInfo.move.url);
          const moveData = await moveResponse.json();
          return { name: moveInfo.move.name, type: moveData.type.name }; // Retornar o nome e o tipo
        });

        const movesWithTypes = await Promise.all(movesPromises);
        setMoves(movesWithTypes);
      } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (!pokemon) {
    return <p>Carregando...</p>;
  }

  return (

    <>

    <ButtonContainer>
        <BackButton onClick={() => navigate('/')}>
          Home
        </BackButton>
      </ButtonContainer>

    <Container>
      

      <Header>
        <Image src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
        <TextContainer>
          <Name>{pokemon.name}</Name>
          {pokemon.types.map(typeInfo => (
            <Type key={typeInfo.type.name} type={typeInfo.type.name}>
              {typeInfo.type.name}
            </Type>
          ))}
        </TextContainer>
      </Header>

      <Section>
        <h2>Habilidades</h2>
        <List>
          {abilitiesDescriptions.map((ability) => (
            <ListItem key={ability.name}>
              <strong>{ability.name}</strong>: {ability.effect}
            </ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <h2>Movimentos</h2>
        <MoveContainer>
          {moves.map((move) => (
            <MoveItem key={move.name} type={move.type}>
              {move.name}
            </MoveItem>
          ))}
        </MoveContainer>
      </Section>
    </Container>
    </>
  );
};

export default PokemonDetail;