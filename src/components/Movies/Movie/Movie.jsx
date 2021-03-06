import React, {useState} from "react";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import classNames from 'classnames';
import Preview from "./Preview";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setLastHomePositionByY} from "../../../redux/movies/moviesActionCreator";
import {setCurrentLocationPath} from "../../../redux/movieInfo/movieInfoActionCreator";
import {getImagePath, getRating, getYear} from "../../../utils/formatMovieData";
import PropTypes from "prop-types";

const Movie = React.memo(function Movie({movie}) {
  const dispatch = useDispatch();
  const allGenres = useSelector(({movies}) => movies.genres);
  const currentLocationPath = useSelector(({movieInfo}) => movieInfo.currentLocationPath);
  const [isShownPreview, setIsShownPreview] = useState(false);

  const {
    id, title, backdrop_path, release_date, vote_average,
    original_language, genre_ids, overview, poster_path, genres
  } = movie;

  const setLastPosition = () => {
    if (currentLocationPath === '/') {
      dispatch(setCurrentLocationPath(window.location.pathname));
      dispatch(setLastHomePositionByY(window.scrollY));
    }
  };

  const getOverview = (overview) => {
    return overview ? overview : 'Unnown description';
  };

  return (
    <div className="movie"
         onMouseEnter={() => setIsShownPreview(true)}
         onMouseLeave={() => setIsShownPreview(false)}
         onClick={setLastPosition}
    >
      <Link to={`/movies/${id}`} className="movie__link">
        <div className="movie__wrapper-image">
          <img className={classNames({
            'movie__image': true,
            'movie__image--active': isShownPreview,
            'movie__image--poster': !backdrop_path,
          })} src={getImagePath(backdrop_path, poster_path)} loading="lazy" alt="movie"
          />
          {isShownPreview && <Preview
            lang={original_language}
            movieGenresInfo={genre_ids || genres}
            allGenres={allGenres}
            overview={getOverview(overview)}
          />}
        </div>
        <div className="movie__info">
          <p className="movie__info-title">
            {title}
          </p>
          <div className="movie__info-additional">
            <div className="movie__info-rating">
            <span className="movie__info-rating-number">
              {getRating(vote_average)}
            </span>
              <StarBorderIcon style={{fontSize: 22}}/>
            </div>
            <span className="movie__info-year">
            {getYear(release_date)}
          </span>
          </div>
        </div>
      </Link>
    </div>
  );
});

Movie.propTypes = {
  movie: PropTypes.object.isRequired
};

export default Movie;
