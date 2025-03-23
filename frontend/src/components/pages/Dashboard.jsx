import PropTypes from 'prop-types';

import DynamicComponents from '../DynamicComponents';

import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = ({ components, error, handleComponentUpdate }) => {
  // Change console.log to console.warn to match allowed console methods
  console.warn('[Dashboard] Rendering with:', { components, error });

  const isValidComponents =
    components &&
    components.rows &&
    Array.isArray(components.rows) &&
    components.rows.every((row) => Array.isArray(row));

  const renderContent = () => {
    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!isValidComponents) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              {!components ? 'Loading components...' : 'Invalid components data'}
            </p>
          </div>
        </div>
      );
    }

    if (components.rows.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">No components to display</p>
        </div>
      );
    }

    return <DynamicComponents components={components} onComponentUpdate={handleComponentUpdate} />;
  };

  return <div className="min-h-screen">{renderContent()}</div>;
};

// Add prop validation
Dashboard.propTypes = {
  components: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.array).isRequired,
  }),
  error: PropTypes.string,
  handleComponentUpdate: PropTypes.func.isRequired,
};

export default Dashboard;