import PropTypes from 'prop-types';

// To fix the prop-types validation error in lint, we need to add prop-types to validate the children prop
const Content = ({ children }) => {
  return <div className="overflow-y-auto">{children}</div>;
};

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Content;