import { useState, useEffect } from "react";
import "../styles/PokeList.css";
import PokemonCard from "./PokemonCard";

const PokeList = () => {
    const [allPokemons, setAllPokemons] = useState([]);
    const [offset, setOffSet] = useState(0);

    const handleScroll = (e) => {
        if (
            window.innerHeight + e.target.scrollTop - 115 ===
            e.target.scrollHeight
        ) {
            getAllPokemons();
        }
    };
    const getAllPokemons = async () => {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=151&offset=${offset}`
        );
        const data = await res.json();
        console.log(data);
        createPokemonObject(data.results);
        setOffSet(offset + 151);
    };

    const createPokemonObject = (results) => {
        results.forEach(async (pokemon) => {
            const newPokemon = [];
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            );
            const data = await res.json();
            newPokemon.push(data);
            setAllPokemons((oldPokemon) => [...oldPokemon, ...newPokemon]);
        });
    };

    useEffect(() => {
        getAllPokemons();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app-container">
            <div className="pokemon-container">
                <div className="all-container" onScroll={handleScroll}>
                    {allPokemons.map((pokemonStats, i) => (
                        <PokemonCard
                            key={i}
                            id={pokemonStats.id.toString().padStart(3, "0")}
                            image={
                                pokemonStats.sprites.other["official-artwork"]
                                    .front_default
                            }
                            name={pokemonStats.name.replace(/^./, (str) =>
                                str.toUpperCase()
                            )}
                            type={pokemonStats.types[0].type.name}
                            weight={pokemonStats.weight}
                            height={pokemonStats.height}
                            stats={pokemonStats.stats
                                .map((stat) => stat.base_stat)
                                .slice(0, 3)}
                            statsName={pokemonStats.stats
                                .map((stat) => stat.stat.name)
                                .slice(0, 3)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PokeList;
