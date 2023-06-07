// importing modules 
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';


const Metadata = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}

Metadata.propTypes = {
  title: PropTypes.string
};


export default Metadata
