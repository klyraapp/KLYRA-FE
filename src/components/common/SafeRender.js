import React from 'react';

/**
 * SafeRender component to prevent crashes when dynamic components are null or invalid.
 * @param {object} props
 * @param {React.ElementType} props.component - The component to render
 * @param {React.ElementType} props.fallback - Fallback component if the main one is invalid
 * @param {object} props.props - Props to pass to the component
 */
export const SafeComponent = ({ component: Component, fallback: Fallback = null, ...props }) => {
  if (!Component || typeof Component === 'undefined') {
    return Fallback ? <Fallback {...props} /> : null;
  }

  // If it's a string, it must be a valid HTML tag. 
  // But usually here we expect a React component (function or class).
  // React allows strings for DOM elements.
  
  try {
    return <Component {...props} />;
  } catch (error) {
    console.error('SafeComponent render error:', error);
    return Fallback ? <Fallback {...props} /> : null;
  }
};

/**
 * Higher-order component to wrap a component with basic existence check.
 */
export const withSafeCheck = (Component, Fallback = null) => {
  return (props) => (
    <SafeComponent component={Component} fallback={Fallback} {...props} />
  );
};

/**
 * Ensures a value is an array before mapping.
 */
export const safeMap = (data, mapFn) => {
  if (!Array.isArray(data)) return null;
  return data.map(mapFn);
};
