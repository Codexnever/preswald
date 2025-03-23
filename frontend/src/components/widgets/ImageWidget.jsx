import PropTypes from 'prop-types';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';

import { cn } from '@/lib/utils';

const ImageWidget = ({
  src,
  alt = '',
  size = 'medium',
  rounded = true,
  className,
  withCard = false,
  aspectRatio = 1,
  objectFit = 'cover',
}) => {
  // Define size classes based on the provided size prop
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-48',
    large: 'w-96',
    full: 'w-full',
  };

  const ImageComponent = (
    <div className={cn(sizeClasses[size], className)}>
      <AspectRatio ratio={aspectRatio} className="overflow-hidden">
        <img
          src={src}
          alt={alt}
          className={cn(
            'h-full w-full object-cover transition-transform duration-200 hover:scale-105',
            rounded && 'rounded-lg',
            objectFit === 'contain' && 'object-contain'
          )}
        />
      </AspectRatio>
    </div>
  );

  if (withCard) {
    return (
      <Card className={cn('p-2', rounded && 'rounded-lg', sizeClasses[size], className)}>
        {ImageComponent}
      </Card>
    );
  }

  return ImageComponent;
};

ImageWidget.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  rounded: PropTypes.bool,
  className: PropTypes.string,
  withCard: PropTypes.bool,
  aspectRatio: PropTypes.number,
  objectFit: PropTypes.oneOf(['cover', 'contain']),
};

export default ImageWidget;
