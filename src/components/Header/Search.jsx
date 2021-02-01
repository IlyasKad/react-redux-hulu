import React, {useEffect, useState} from "react";
import {API_GET_SEARCH_MOVIES} from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {
  setCountSearchPage,
  setEmptySearchMovies,
  setIsSearching,
  setQueryValue,
  setSearchMovies, setTotalMovies
} from "../../redux/actions/search";
import searchLoader from '../../assets/img/searchLoder.svg';

const Search = () => {
  const dispatch = useDispatch();
  const queryValue = useSelector(({searchReducer}) => searchReducer.queryValue);

  const [isLoaderActive, setIsLoaderActive] = useState(false); // for loader of search input

  const loaderStyles = {
    backgroundImage: `url(${searchLoader})`,
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
  };

  useEffect(() => {
    async function fetchData() {
      const formatQueryValue = queryValue.trim().toLowerCase(); // ??? is it need?
      if (formatQueryValue) {
        const response = await fetch(`${API_GET_SEARCH_MOVIES}&page=1&query=${formatQueryValue}`);
        const json = await response.json();
        dispatch(setTotalMovies(json.total_results));
        dispatch(setSearchMovies(json.results));
      } else { // will enter at the first rendering and when deleting last input char
        dispatch(setIsSearching(false)); // to show all movies when deleting last input char
      }
      setIsLoaderActive(false); // deactivate search loader
    }

    fetchData().then(); // TODO
  }, [queryValue]);

  const searchMoviesByQuery = (event) => {
    // dispatch(setTotalMovies(0));
    dispatch(setCountSearchPage(2));
    dispatch(setEmptySearchMovies([]));
    setIsLoaderActive(true); // activate search loader
    dispatch(setQueryValue(event.target.value)); // change value of input
    dispatch(setIsSearching(true)); // set searching view mode
  }

  const styles = isLoaderActive ? loaderStyles : {};

  return (
    <div className="search">
      <input className="search__input"
             type="search"
             onChange={searchMoviesByQuery}
             value={queryValue}
             style={styles}
             maxLength={50}
      />
    </div>
  )
};

export default Search;
